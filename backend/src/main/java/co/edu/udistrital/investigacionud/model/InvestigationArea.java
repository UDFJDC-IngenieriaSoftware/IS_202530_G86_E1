package co.edu.udistrital.investigacionud.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "Investigation_area")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class InvestigationArea {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "investigation_area_id")
    private Integer investigationAreaId;
    
    @Column(name = "project_area_id", nullable = false)
    private Integer projectAreaId;
    
    @Column(name = "name", nullable = false)
    private String name;
    
    @Column(name = "description", nullable = false, columnDefinition = "TEXT")
    private String description;
    
    @ManyToOne
    @JoinColumn(name = "project_area_id", insertable = false, updatable = false)
    private ProjectArea projectArea;
    
    @OneToMany(mappedBy = "investigationArea", cascade = CascadeType.ALL)
    private List<InvestigationTeam> investigationTeams;
}

