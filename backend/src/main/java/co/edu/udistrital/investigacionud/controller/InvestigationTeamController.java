package co.edu.udistrital.investigacionud.controller;

import co.edu.udistrital.investigacionud.dto.InvestigationTeamDTO;
import co.edu.udistrital.investigacionud.service.InvestigationTeamService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teams")
@CrossOrigin(origins = "*")
public class InvestigationTeamController {

    private final InvestigationTeamService teamService;

    public InvestigationTeamController(InvestigationTeamService teamService) {
        this.teamService = teamService;
    }

    @GetMapping("/public")
    public ResponseEntity<List<InvestigationTeamDTO>> getAllTeams() {
        return ResponseEntity.ok(teamService.getAllTeams());
    }

    @GetMapping("/public/{id}")
    public ResponseEntity<InvestigationTeamDTO> getTeamById(@PathVariable Integer id) {
        return ResponseEntity.ok(teamService.getTeamById(id));
    }

    @GetMapping("/public/area/{areaId}")
    public ResponseEntity<List<InvestigationTeamDTO>> getTeamsByArea(@PathVariable Integer areaId) {
        return ResponseEntity.ok(teamService.getTeamsByArea(areaId));
    }

    @PostMapping
    @PreAuthorize("hasRole('COORDINADOR') or hasRole('ADMINISTRADOR')")
    public ResponseEntity<InvestigationTeamDTO> createTeam(@RequestBody InvestigationTeamDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(teamService.createTeam(dto));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('COORDINADOR') or hasRole('ADMINISTRADOR')")
    public ResponseEntity<InvestigationTeamDTO> updateTeam(@PathVariable Integer id, @RequestBody InvestigationTeamDTO dto) {
        return ResponseEntity.ok(teamService.updateTeam(id, dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<Void> deleteTeam(@PathVariable Integer id) {
        teamService.deleteTeam(id);
        return ResponseEntity.noContent().build();
    }
}

