package co.edu.udistrital.investigacionud.service;

import co.edu.udistrital.investigacionud.dto.UserDTO;
import co.edu.udistrital.investigacionud.model.User;
import co.edu.udistrital.investigacionud.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public UserDTO getUserById(Integer id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return convertToDTO(user);
    }

    public UserDTO getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return convertToDTO(user);
    }

    @Transactional
    public UserDTO updateUser(Integer id, UserDTO dto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (dto.getName() != null) {
            user.setName(dto.getName());
        }
        if (dto.getEmail() != null && !dto.getEmail().equals(user.getEmail())) {
            if (!dto.getEmail().endsWith("@udistrital.edu.co")) {
                throw new IllegalArgumentException("El email debe ser del dominio @udistrital.edu.co");
            }
            if (userRepository.existsByEmail(dto.getEmail())) {
                throw new IllegalArgumentException("El email ya está en uso");
            }
            user.setEmail(dto.getEmail());
        }
        if (dto.getRole() != null) {
            user.setRole(User.Role.valueOf(dto.getRole()));
        }

        user = userRepository.save(user);
        return convertToDTO(user);
    }

    @Transactional
    public void deleteUser(Integer id) {
        userRepository.deleteById(id);
    }

    @Transactional
    public UserDTO updatePassword(Integer id, String newPassword) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        user.setPassword(passwordEncoder.encode(newPassword));
        user = userRepository.save(user);
        return convertToDTO(user);
    }

    private UserDTO convertToDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setUserId(user.getUserId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole().name());

        // Obtener projectAreaId si es estudiante o coordinador
        if (user.getStudent() != null) {
            dto.setProjectAreaId(user.getStudent().getProjectId());
        } else if (user.getTeachers() != null && !user.getTeachers().isEmpty()) {
            dto.setProjectAreaId(user.getTeachers().get(0).getProjectId());
        }

        return dto;
    }
}

