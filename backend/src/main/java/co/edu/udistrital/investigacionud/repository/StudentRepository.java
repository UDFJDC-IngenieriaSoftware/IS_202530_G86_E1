package co.edu.udistrital.investigacionud.repository;

import co.edu.udistrital.investigacionud.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Student.StudentId> {
    Optional<Student> findByStudentId(Integer studentId);
    
    @Query("SELECT MAX(s.studentId) FROM Student s")
    Optional<Integer> findMaxStudentId();
}

