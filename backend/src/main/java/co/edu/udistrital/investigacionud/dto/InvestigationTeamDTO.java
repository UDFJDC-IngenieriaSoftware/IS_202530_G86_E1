package co.edu.udistrital.investigacionud.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InvestigationTeamDTO {
    private Integer investigationTeamId;
    private Integer areaId;
    private Integer cordinatorId;
    private String name;
    private String teamEmail;
    private String description;
    private String areaName;
    private String coordinatorName;
    private List<InvestigationProjectDTO> projects;
}

