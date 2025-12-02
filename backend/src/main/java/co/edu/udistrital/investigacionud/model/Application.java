package co.edu.udistrital.investigacionud.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "Application")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Application {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "application_id")
    private Integer applicationId;
    
    @Column(name = "user_id", nullable = false)
    private Integer userId;
    
    @Column(name = "investigation_team_id", nullable = false)
    private Integer investigationTeamId;
    
    @Column(name = "state", nullable = false)
    private String state;
    
    @Column(name = "application_date", nullable = false)
    private LocalDate applicationDate;
    
    @Column(name = "application_message", nullable = false, columnDefinition = "TEXT")
    private String applicationMessage;
    
    @Column(name = "answer_date")
    private LocalDate answerDate;
    
    @Column(name = "answer_message", columnDefinition = "TEXT")
    private String answerMessage;
    
    @ManyToOne
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    private User user;
    
    @ManyToOne
    @JoinColumn(name = "investigation_team_id", insertable = false, updatable = false)
    private InvestigationTeam investigationTeam;
}

