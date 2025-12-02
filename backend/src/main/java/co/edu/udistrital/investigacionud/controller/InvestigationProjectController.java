package co.edu.udistrital.investigacionud.controller;

import co.edu.udistrital.investigacionud.dto.InvestigationProjectDTO;
import co.edu.udistrital.investigacionud.service.InvestigationProjectService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@CrossOrigin(origins = "*")
public class InvestigationProjectController {

    private final InvestigationProjectService projectService;

    public InvestigationProjectController(InvestigationProjectService projectService) {
        this.projectService = projectService;
    }

    @GetMapping("/public")
    public ResponseEntity<List<InvestigationProjectDTO>> getAllProjects() {
        return ResponseEntity.ok(projectService.getAllProjects());
    }

    @GetMapping("/public/{id}")
    public ResponseEntity<InvestigationProjectDTO> getProjectById(@PathVariable Integer id) {
        return ResponseEntity.ok(projectService.getProjectById(id));
    }

    @GetMapping("/public/team/{teamId}")
    public ResponseEntity<List<InvestigationProjectDTO>> getProjectsByTeam(@PathVariable Integer teamId) {
        return ResponseEntity.ok(projectService.getProjectsByTeam(teamId));
    }

    @PostMapping
    @PreAuthorize("hasRole('COORDINADOR') or hasRole('ADMINISTRADOR')")
    public ResponseEntity<InvestigationProjectDTO> createProject(@RequestBody InvestigationProjectDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(projectService.createProject(dto));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('COORDINADOR') or hasRole('ADMINISTRADOR')")
    public ResponseEntity<InvestigationProjectDTO> updateProject(@PathVariable Integer id, @RequestBody InvestigationProjectDTO dto) {
        return ResponseEntity.ok(projectService.updateProject(id, dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<Void> deleteProject(@PathVariable Integer id) {
        projectService.deleteProject(id);
        return ResponseEntity.noContent().build();
    }
}

