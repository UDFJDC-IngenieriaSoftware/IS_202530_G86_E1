package co.edu.udistrital.investigacionud.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "Teacher")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Teacher {
    
    @EmbeddedId
    private TeacherId id;
    
    @ManyToOne
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    private User user;
    
    @Column(name = "teacher_id", insertable = false, updatable = false)
    private Integer teacherId;
    
    @Column(name = "team_id")
    private Integer teamId;
    
    @Column(name = "project_id", nullable = false)
    private Integer projectId;
    
    @Column(name = "teacher_email", nullable = false)
    private String teacherEmail;
    
    @ManyToOne
    @JoinColumn(name = "project_id", insertable = false, updatable = false)
    private ProjectArea projectArea;
    
    @ManyToOne
    @JoinColumn(name = "team_id", insertable = false, updatable = false)
    private InvestigationTeam investigationTeam;
    
    @OneToMany(mappedBy = "teacher", cascade = CascadeType.ALL)
    private List<Cordinator> coordinators;
    
    @OneToMany(mappedBy = "teacher", cascade = CascadeType.ALL)
    private List<ProductTeacher> productTeachers;
    
    @Embeddable
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TeacherId implements java.io.Serializable {
        @Column(name = "user_id")
        private Integer userId;
        
        @Column(name = "teacher_id")
        private Integer teacherId;
    }
}

