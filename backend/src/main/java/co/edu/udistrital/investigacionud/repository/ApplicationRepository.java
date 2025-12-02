package co.edu.udistrital.investigacionud.repository;

import co.edu.udistrital.investigacionud.model.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Integer> {
    List<Application> findByUserId(Integer userId);
    List<Application> findByInvestigationTeamId(Integer investigationTeamId);
    List<Application> findByInvestigationTeamIdAndState(Integer investigationTeamId, String state);
}

