package co.edu.udistrital.investigacionud.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InvestigationProjectDTO {
    private Integer investigationProjectId;
    private Integer teamId;
    private String title;
    private String resume;
    private Integer state;
    private String teamName;
    private List<ProductDTO> products;
}

