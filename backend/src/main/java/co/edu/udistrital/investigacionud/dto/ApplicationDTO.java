package co.edu.udistrital.investigacionud.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationDTO {
    private Integer applicationId;
    private Integer userId;
    private Integer investigationTeamId;
    private String state;
    private LocalDate applicationDate;
    private String applicationMessage;
    private LocalDate answerDate;
    private String answerMessage;
    private String userName;
    private String userEmail;
    private String teamName;
}

