package co.edu.udistrital.investigacionud.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "Investigation_project")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class InvestigationProject {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "investigation_project_id")
    private Integer investigationProjectId;
    
    @Column(name = "team_id", nullable = false)
    private Integer teamId;
    
    @Column(name = "title", nullable = false)
    private String title;
    
    @Column(name = "resume", nullable = false, columnDefinition = "TEXT")
    private String resume;
    
    @Column(name = "state", nullable = false)
    private Integer state;
    
    @ManyToOne
    @JoinColumn(name = "team_id", insertable = false, updatable = false)
    private InvestigationTeam investigationTeam;
    
    @OneToMany(mappedBy = "investigationProject", cascade = CascadeType.ALL)
    private List<Product> products;
}

