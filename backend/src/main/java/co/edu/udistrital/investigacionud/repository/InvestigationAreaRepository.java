package co.edu.udistrital.investigacionud.repository;

import co.edu.udistrital.investigacionud.model.InvestigationArea;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InvestigationAreaRepository extends JpaRepository<InvestigationArea, Integer> {
    List<InvestigationArea> findByProjectAreaId(Integer projectAreaId);
}

