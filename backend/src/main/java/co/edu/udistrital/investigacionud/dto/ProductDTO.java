package co.edu.udistrital.investigacionud.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductDTO {
    private Integer productId;
    private Integer investigationProjectId;
    private Integer typeProductId;
    private String title;
    private String document;
    private LocalDate publicDate;
    private String projectTitle;
    private String productTypeName;
    private List<String> studentNames;
    private List<String> teacherNames;
}

