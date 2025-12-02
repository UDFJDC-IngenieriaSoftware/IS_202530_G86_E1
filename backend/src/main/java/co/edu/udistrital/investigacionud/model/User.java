package co.edu.udistrital.investigacionud.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "app_user")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Integer userId;
    
    @Column(name = "name", nullable = false)
    private String name;
    
    @Column(name = "email", nullable = false, unique = true)
    private String email;
    
    @Column(name = "password", nullable = false)
    private String password;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "role")
    private Role role;
    
    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private Student student;
    
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Teacher> teachers;
    
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Application> applications;
    
    public enum Role {
        ESTUDIANTE,
        COORDINADOR,
        ADMINISTRADOR
    }
}

