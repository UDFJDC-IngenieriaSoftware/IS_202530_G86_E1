package co.edu.udistrital.investigacionud.service;

import co.edu.udistrital.investigacionud.dto.InvestigationProjectDTO;
import co.edu.udistrital.investigacionud.dto.InvestigationTeamDTO;
import co.edu.udistrital.investigacionud.model.Cordinator;
import co.edu.udistrital.investigacionud.model.InvestigationArea;
import co.edu.udistrital.investigacionud.model.InvestigationProject;
import co.edu.udistrital.investigacionud.model.InvestigationTeam;
import co.edu.udistrital.investigacionud.repository.CordinatorRepository;
import co.edu.udistrital.investigacionud.repository.InvestigationAreaRepository;
import co.edu.udistrital.investigacionud.repository.InvestigationProjectRepository;
import co.edu.udistrital.investigacionud.repository.InvestigationTeamRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class InvestigationTeamService {

    private final InvestigationTeamRepository teamRepository;
    private final InvestigationAreaRepository areaRepository;
    private final CordinatorRepository cordinatorRepository;
    private final InvestigationProjectRepository projectRepository;

    public InvestigationTeamService(
            InvestigationTeamRepository teamRepository,
            InvestigationAreaRepository areaRepository,
            CordinatorRepository cordinatorRepository,
            InvestigationProjectRepository projectRepository) {
        this.teamRepository = teamRepository;
        this.areaRepository = areaRepository;
        this.cordinatorRepository = cordinatorRepository;
        this.projectRepository = projectRepository;
    }

    public List<InvestigationTeamDTO> getAllTeams() {
        return teamRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public InvestigationTeamDTO getTeamById(Integer id) {
        InvestigationTeam team = teamRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Grupo de investigación no encontrado"));
        return convertToDTO(team);
    }

    public List<InvestigationTeamDTO> getTeamsByArea(Integer areaId) {
        return teamRepository.findAll().stream()
                .filter(team -> team.getAreaId().equals(areaId))
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public InvestigationTeamDTO createTeam(InvestigationTeamDTO dto) {
        InvestigationTeam team = new InvestigationTeam();
        team.setAreaId(dto.getAreaId());
        team.setCordinatorId(dto.getCordinatorId());
        team.setName(dto.getName());
        team.setTeamEmail(dto.getTeamEmail());
        team.setDescription(dto.getDescription());

        team = teamRepository.save(team);
        return convertToDTO(team);
    }

    @Transactional
    public InvestigationTeamDTO updateTeam(Integer id, InvestigationTeamDTO dto) {
        InvestigationTeam team = teamRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Grupo de investigación no encontrado"));

        team.setName(dto.getName());
        team.setTeamEmail(dto.getTeamEmail());
        team.setDescription(dto.getDescription());
        if (dto.getAreaId() != null) {
            team.setAreaId(dto.getAreaId());
        }
        if (dto.getCordinatorId() != null) {
            team.setCordinatorId(dto.getCordinatorId());
        }

        team = teamRepository.save(team);
        return convertToDTO(team);
    }

    @Transactional
    public void deleteTeam(Integer id) {
        teamRepository.deleteById(id);
    }

    private InvestigationTeamDTO convertToDTO(InvestigationTeam team) {
        InvestigationTeamDTO dto = new InvestigationTeamDTO();
        dto.setInvestigationTeamId(team.getInvestigationTeamId());
        dto.setAreaId(team.getAreaId());
        dto.setCordinatorId(team.getCordinatorId());
        dto.setName(team.getName());
        dto.setTeamEmail(team.getTeamEmail());
        dto.setDescription(team.getDescription());

        if (team.getInvestigationArea() != null) {
            dto.setAreaName(team.getInvestigationArea().getName());
        }

        if (team.getCordinator() != null && team.getCordinator().getTeacher() != null 
                && team.getCordinator().getTeacher().getUser() != null) {
            dto.setCoordinatorName(team.getCordinator().getTeacher().getUser().getName());
        }

        if (team.getInvestigationProjects() != null) {
            dto.setProjects(team.getInvestigationProjects().stream()
                    .map(this::convertProjectToDTO)
                    .collect(Collectors.toList()));
        }

        return dto;
    }

    private InvestigationProjectDTO convertProjectToDTO(InvestigationProject project) {
        InvestigationProjectDTO dto = new InvestigationProjectDTO();
        dto.setInvestigationProjectId(project.getInvestigationProjectId());
        dto.setTeamId(project.getTeamId());
        dto.setTitle(project.getTitle());
        dto.setResume(project.getResume());
        dto.setState(project.getState());
        if (project.getInvestigationTeam() != null) {
            dto.setTeamName(project.getInvestigationTeam().getName());
        }
        return dto;
    }
}

