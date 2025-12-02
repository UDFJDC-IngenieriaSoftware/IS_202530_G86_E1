package co.edu.udistrital.investigacionud.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "Cordinator")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Cordinator {
    
    @EmbeddedId
    private CordinatorId id;
    
    @Column(name = "coordinator_id", insertable = false, updatable = false)
    private Integer coordinatorId;
    
    @Column(name = "teacher_id", insertable = false, updatable = false)
    private Integer teacherId;
    
    @ManyToOne
    @JoinColumn(name = "teacher_id", insertable = false, updatable = false)
    private Teacher teacher;
    
    @OneToMany(mappedBy = "cordinator", cascade = CascadeType.ALL)
    private List<InvestigationTeam> investigationTeams;
    
    @Embeddable
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CordinatorId implements java.io.Serializable {
        @Column(name = "coordinator_id")
        private Integer coordinatorId;
        
        @Column(name = "teacher_id")
        private Integer teacherId;
    }
}

