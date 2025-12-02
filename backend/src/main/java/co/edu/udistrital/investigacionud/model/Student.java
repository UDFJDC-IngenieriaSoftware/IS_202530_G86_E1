package co.edu.udistrital.investigacionud.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "Student")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Student {
    
    @EmbeddedId
    private StudentId id;
    
    @ManyToOne
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    private User user;
    
    @Column(name = "student_id", insertable = false, updatable = false)
    private Integer studentId;
    
    @Column(name = "team_id")
    private Integer teamId;
    
    @Column(name = "project_id", nullable = false)
    private Integer projectId;
    
    @Column(name = "student_email", nullable = false)
    private String studentEmail;
    
    @ManyToOne
    @JoinColumn(name = "project_id", insertable = false, updatable = false)
    private ProjectArea projectArea;
    
    @ManyToOne
    @JoinColumn(name = "team_id", insertable = false, updatable = false)
    private InvestigationTeam investigationTeam;
    
    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL)
    private List<ProductStudent> productStudents;
    
    @Embeddable
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StudentId implements java.io.Serializable {
        @Column(name = "user_id")
        private Integer userId;
        
        @Column(name = "student_id")
        private Integer studentId;
    }
}

