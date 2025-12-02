package co.edu.udistrital.investigacionud.service;

import co.edu.udistrital.investigacionud.dto.AuthRequest;
import co.edu.udistrital.investigacionud.dto.AuthResponse;
import co.edu.udistrital.investigacionud.dto.RegisterRequest;
import co.edu.udistrital.investigacionud.model.ProjectArea;
import co.edu.udistrital.investigacionud.model.Student;
import co.edu.udistrital.investigacionud.model.Teacher;
import co.edu.udistrital.investigacionud.model.User;
import co.edu.udistrital.investigacionud.repository.ProjectAreaRepository;
import co.edu.udistrital.investigacionud.repository.StudentRepository;
import co.edu.udistrital.investigacionud.repository.TeacherRepository;
import co.edu.udistrital.investigacionud.repository.UserRepository;
import co.edu.udistrital.investigacionud.security.JwtTokenProvider;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final TeacherRepository teacherRepository;
    private final ProjectAreaRepository projectAreaRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final AuthenticationManager authenticationManager;

    public AuthService(
            UserRepository userRepository,
            StudentRepository studentRepository,
            TeacherRepository teacherRepository,
            ProjectAreaRepository projectAreaRepository,
            PasswordEncoder passwordEncoder,
            JwtTokenProvider tokenProvider,
            AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
        this.teacherRepository = teacherRepository;
        this.projectAreaRepository = projectAreaRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
        this.authenticationManager = authenticationManager;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        // Validar dominio de email
        if (!request.getEmail().endsWith("@udistrital.edu.co")) {
            throw new IllegalArgumentException("El email debe ser del dominio @udistrital.edu.co");
        }

        // Verificar si el usuario ya existe
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("El email ya está registrado");
        }

        // Crear usuario
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole() != null ? request.getRole() : User.Role.ESTUDIANTE);
        
        user = userRepository.save(user);

        // Crear perfil según el rol
        if (user.getRole() == User.Role.ESTUDIANTE && request.getProjectAreaId() != null) {
            createStudentProfile(user, request.getProjectAreaId());
        } else if (user.getRole() == User.Role.COORDINADOR && request.getProjectAreaId() != null) {
            createTeacherProfile(user, request.getProjectAreaId());
        }

        // Generar token
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        String token = tokenProvider.generateToken(authentication);

        return new AuthResponse(token, user.getEmail(), user.getName(), 
                               user.getRole().name(), "Registro exitoso");
    }

    public AuthResponse login(AuthRequest request) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = tokenProvider.generateToken(authentication);

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        return new AuthResponse(token, user.getEmail(), user.getName(), 
                               user.getRole().name(), "Inicio de sesión exitoso");
    }

    private void createStudentProfile(User user, Integer projectAreaId) {
        ProjectArea projectArea = projectAreaRepository.findById(projectAreaId)
                .orElseThrow(() -> new IllegalArgumentException("Área de proyecto no encontrada"));

        Student student = new Student();
        Student.StudentId studentId = new Student.StudentId();
        studentId.setUserId(user.getUserId());
        
        // Generar un student_id único (podría ser secuencial)
        Integer maxStudentId = studentRepository.findMaxStudentId()
                .orElse(0);
        studentId.setStudentId(maxStudentId + 1);
        
        student.setId(studentId);
        student.setStudentId(studentId.getStudentId());
        student.setProjectId(projectAreaId);
        student.setStudentEmail(user.getEmail());
        student.setUser(user);
        
        studentRepository.save(student);
    }

    private void createTeacherProfile(User user, Integer projectAreaId) {
        ProjectArea projectArea = projectAreaRepository.findById(projectAreaId)
                .orElseThrow(() -> new IllegalArgumentException("Área de proyecto no encontrada"));

        Teacher teacher = new Teacher();
        Teacher.TeacherId teacherId = new Teacher.TeacherId();
        teacherId.setUserId(user.getUserId());
        
        // Generar un teacher_id único
        Integer maxTeacherId = teacherRepository.findMaxTeacherId()
                .orElse(0);
        teacherId.setTeacherId(maxTeacherId + 1);
        
        teacher.setId(teacherId);
        teacher.setTeacherId(teacherId.getTeacherId());
        teacher.setProjectId(projectAreaId);
        teacher.setTeacherEmail(user.getEmail());
        teacher.setUser(user);
        
        teacherRepository.save(teacher);
    }
}

