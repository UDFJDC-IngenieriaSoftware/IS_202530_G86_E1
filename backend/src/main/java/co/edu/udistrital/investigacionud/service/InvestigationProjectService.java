package co.edu.udistrital.investigacionud.service;

import co.edu.udistrital.investigacionud.dto.InvestigationProjectDTO;
import co.edu.udistrital.investigacionud.model.InvestigationProject;
import co.edu.udistrital.investigacionud.model.InvestigationTeam;
import co.edu.udistrital.investigacionud.repository.InvestigationProjectRepository;
import co.edu.udistrital.investigacionud.repository.InvestigationTeamRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class InvestigationProjectService {

    private final InvestigationProjectRepository projectRepository;
    private final InvestigationTeamRepository teamRepository;

    public InvestigationProjectService(
            InvestigationProjectRepository projectRepository,
            InvestigationTeamRepository teamRepository) {
        this.projectRepository = projectRepository;
        this.teamRepository = teamRepository;
    }

    public List<InvestigationProjectDTO> getAllProjects() {
        return projectRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public InvestigationProjectDTO getProjectById(Integer id) {
        InvestigationProject project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Proyecto no encontrado"));
        return convertToDTO(project);
    }

    public List<InvestigationProjectDTO> getProjectsByTeam(Integer teamId) {
        return projectRepository.findByTeamId(teamId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public InvestigationProjectDTO createProject(InvestigationProjectDTO dto) {
        InvestigationProject project = new InvestigationProject();
        project.setTeamId(dto.getTeamId());
        project.setTitle(dto.getTitle());
        project.setResume(dto.getResume());
        project.setState(dto.getState() != null ? dto.getState() : 1); // 1 = activo por defecto

        project = projectRepository.save(project);
        return convertToDTO(project);
    }

    @Transactional
    public InvestigationProjectDTO updateProject(Integer id, InvestigationProjectDTO dto) {
        InvestigationProject project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Proyecto no encontrado"));

        if (dto.getTitle() != null) {
            project.setTitle(dto.getTitle());
        }
        if (dto.getResume() != null) {
            project.setResume(dto.getResume());
        }
        if (dto.getState() != null) {
            project.setState(dto.getState());
        }

        project = projectRepository.save(project);
        return convertToDTO(project);
    }

    @Transactional
    public void deleteProject(Integer id) {
        projectRepository.deleteById(id);
    }

    private InvestigationProjectDTO convertToDTO(InvestigationProject project) {
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

