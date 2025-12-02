package co.edu.udistrital.investigacionud.repository;

import co.edu.udistrital.investigacionud.model.ProjectArea;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProjectAreaRepository extends JpaRepository<ProjectArea, Integer> {
}

