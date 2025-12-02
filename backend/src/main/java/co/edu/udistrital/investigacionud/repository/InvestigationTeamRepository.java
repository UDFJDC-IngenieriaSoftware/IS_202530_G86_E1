package co.edu.udistrital.investigacionud.repository;

import co.edu.udistrital.investigacionud.model.InvestigationTeam;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InvestigationTeamRepository extends JpaRepository<InvestigationTeam, Integer> {
    List<InvestigationTeam> findByAreaId(Integer areaId);
}

