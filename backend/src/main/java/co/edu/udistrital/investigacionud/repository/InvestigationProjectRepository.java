package co.edu.udistrital.investigacionud.repository;

import co.edu.udistrital.investigacionud.model.InvestigationProject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InvestigationProjectRepository extends JpaRepository<InvestigationProject, Integer> {
    List<InvestigationProject> findByTeamId(Integer teamId);
}

