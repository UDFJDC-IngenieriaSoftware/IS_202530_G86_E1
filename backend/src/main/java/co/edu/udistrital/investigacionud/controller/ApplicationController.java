package co.edu.udistrital.investigacionud.controller;

import co.edu.udistrital.investigacionud.dto.ApplicationDTO;
import co.edu.udistrital.investigacionud.service.ApplicationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/applications")
@CrossOrigin(origins = "*")
public class ApplicationController {

    private final ApplicationService applicationService;

    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @PostMapping
    @PreAuthorize("hasRole('ESTUDIANTE')")
    public ResponseEntity<ApplicationDTO> createApplication(
            @RequestBody ApplicationDTO dto,
            Authentication authentication) {
        String userEmail = authentication.getName();
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(applicationService.createApplication(dto, userEmail));
    }

    @GetMapping("/my-applications")
    @PreAuthorize("hasRole('ESTUDIANTE')")
    public ResponseEntity<List<ApplicationDTO>> getMyApplications(Authentication authentication) {
        String userEmail = authentication.getName();
        return ResponseEntity.ok(applicationService.getApplicationsByUser(userEmail));
    }

    @GetMapping("/team/{teamId}")
    @PreAuthorize("hasRole('COORDINADOR') or hasRole('ADMINISTRADOR')")
    public ResponseEntity<List<ApplicationDTO>> getApplicationsByTeam(@PathVariable Integer teamId) {
        return ResponseEntity.ok(applicationService.getApplicationsByTeam(teamId));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('COORDINADOR') or hasRole('ADMINISTRADOR')")
    public ResponseEntity<ApplicationDTO> updateApplicationStatus(
            @PathVariable Integer id,
            @RequestBody Map<String, String> request) {
        String state = request.get("state");
        String answerMessage = request.get("answerMessage");
        return ResponseEntity.ok(applicationService.updateApplicationStatus(id, state, answerMessage));
    }
}

