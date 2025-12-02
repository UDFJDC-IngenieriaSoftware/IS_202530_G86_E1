package co.edu.udistrital.investigacionud.controller;

import co.edu.udistrital.investigacionud.model.InvestigationArea;
import co.edu.udistrital.investigacionud.model.ProductType;
import co.edu.udistrital.investigacionud.model.ProjectArea;
import co.edu.udistrital.investigacionud.repository.InvestigationAreaRepository;
import co.edu.udistrital.investigacionud.repository.ProductTypeRepository;
import co.edu.udistrital.investigacionud.repository.ProjectAreaRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/public")
@CrossOrigin(origins = "*")
public class PublicController {

    private final ProjectAreaRepository projectAreaRepository;
    private final InvestigationAreaRepository investigationAreaRepository;
    private final ProductTypeRepository productTypeRepository;

    public PublicController(
            ProjectAreaRepository projectAreaRepository,
            InvestigationAreaRepository investigationAreaRepository,
            ProductTypeRepository productTypeRepository) {
        this.projectAreaRepository = projectAreaRepository;
        this.investigationAreaRepository = investigationAreaRepository;
        this.productTypeRepository = productTypeRepository;
    }

    @GetMapping("/project-areas")
    public ResponseEntity<List<ProjectArea>> getAllProjectAreas() {
        return ResponseEntity.ok(projectAreaRepository.findAll());
    }

    @GetMapping("/investigation-areas")
    public ResponseEntity<List<InvestigationArea>> getAllInvestigationAreas() {
        return ResponseEntity.ok(investigationAreaRepository.findAll());
    }

    @GetMapping("/product-types")
    public ResponseEntity<List<ProductType>> getAllProductTypes() {
        return ResponseEntity.ok(productTypeRepository.findAll());
    }
}

