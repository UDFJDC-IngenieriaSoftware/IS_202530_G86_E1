package co.edu.udistrital.investigacionud.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "Project_area")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProjectArea {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "proyect_area_id")
    private Integer proyectAreaId;
    
    @Column(name = "name", nullable = false)
    private String name;
    
    @Column(name = "project_email", nullable = false)
    private String projectEmail;
    
    @OneToMany(mappedBy = "projectArea", cascade = CascadeType.ALL)
    private List<InvestigationArea> investigationAreas;
    
    @OneToMany(mappedBy = "projectArea", cascade = CascadeType.ALL)
    private List<Teacher> teachers;
    
    @OneToMany(mappedBy = "projectArea", cascade = CascadeType.ALL)
    private List<Student> students;
}

