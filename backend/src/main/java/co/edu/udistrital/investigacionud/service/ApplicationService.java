package co.edu.udistrital.investigacionud.service;

import co.edu.udistrital.investigacionud.dto.ApplicationDTO;
import co.edu.udistrital.investigacionud.model.Application;
import co.edu.udistrital.investigacionud.model.InvestigationTeam;
import co.edu.udistrital.investigacionud.model.User;
import co.edu.udistrital.investigacionud.repository.ApplicationRepository;
import co.edu.udistrital.investigacionud.repository.InvestigationTeamRepository;
import co.edu.udistrital.investigacionud.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final UserRepository userRepository;
    private final InvestigationTeamRepository teamRepository;

    public ApplicationService(
            ApplicationRepository applicationRepository,
            UserRepository userRepository,
            InvestigationTeamRepository teamRepository) {
        this.applicationRepository = applicationRepository;
        this.userRepository = userRepository;
        this.teamRepository = teamRepository;
    }

    @Transactional
    public ApplicationDTO createApplication(ApplicationDTO dto, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        InvestigationTeam team = teamRepository.findById(dto.getInvestigationTeamId())
                .orElseThrow(() -> new RuntimeException("Grupo de investigación no encontrado"));

        Application application = new Application();
        application.setUserId(user.getUserId());
        application.setInvestigationTeamId(dto.getInvestigationTeamId());
        application.setState("PENDIENTE");
        application.setApplicationDate(LocalDate.now());
        application.setApplicationMessage(dto.getApplicationMessage());

        application = applicationRepository.save(application);
        return convertToDTO(application);
    }

    public List<ApplicationDTO> getApplicationsByUser(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        return applicationRepository.findByUserId(user.getUserId()).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<ApplicationDTO> getApplicationsByTeam(Integer teamId) {
        return applicationRepository.findByInvestigationTeamId(teamId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public ApplicationDTO updateApplicationStatus(Integer applicationId, String state, String answerMessage) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Solicitud no encontrada"));

        application.setState(state);
        application.setAnswerDate(LocalDate.now());
        application.setAnswerMessage(answerMessage);

        application = applicationRepository.save(application);
        return convertToDTO(application);
    }

    private ApplicationDTO convertToDTO(Application application) {
        ApplicationDTO dto = new ApplicationDTO();
        dto.setApplicationId(application.getApplicationId());
        dto.setUserId(application.getUserId());
        dto.setInvestigationTeamId(application.getInvestigationTeamId());
        dto.setState(application.getState());
        dto.setApplicationDate(application.getApplicationDate());
        dto.setApplicationMessage(application.getApplicationMessage());
        dto.setAnswerDate(application.getAnswerDate());
        dto.setAnswerMessage(application.getAnswerMessage());

        if (application.getUser() != null) {
            dto.setUserName(application.getUser().getName());
            dto.setUserEmail(application.getUser().getEmail());
        }

        if (application.getInvestigationTeam() != null) {
            dto.setTeamName(application.getInvestigationTeam().getName());
        }

        return dto;
    }
}

