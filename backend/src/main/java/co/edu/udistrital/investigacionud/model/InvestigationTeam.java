package co.edu.udistrital.investigacionud.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "Investigation_team")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class InvestigationTeam {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "investigation_team_id")
    private Integer investigationTeamId;
    
    @Column(name = "area_id", nullable = false)
    private Integer areaId;
    
    @Column(name = "cordinator_id", nullable = false)
    private Integer cordinatorId;
    
    @Column(name = "name", nullable = false)
    private String name;
    
    @Column(name = "team_email", nullable = false)
    private String teamEmail;
    
    @Column(name = "description", nullable = false, columnDefinition = "TEXT")
    private String description;
    
    @ManyToOne
    @JoinColumn(name = "area_id", insertable = false, updatable = false)
    private InvestigationArea investigationArea;
    
    @ManyToOne
    @JoinColumn(name = "cordinator_id", insertable = false, updatable = false)
    private Cordinator cordinator;
    
    @OneToMany(mappedBy = "investigationTeam", cascade = CascadeType.ALL)
    private List<InvestigationProject> investigationProjects;
    
    @OneToMany(mappedBy = "investigationTeam", cascade = CascadeType.ALL)
    private List<Application> applications;
    
    @OneToMany(mappedBy = "investigationTeam", cascade = CascadeType.ALL)
    private List<Teacher> teachers;
    
    @OneToMany(mappedBy = "investigationTeam", cascade = CascadeType.ALL)
    private List<Student> students;
}

