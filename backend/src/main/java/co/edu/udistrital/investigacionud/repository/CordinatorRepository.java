package co.edu.udistrital.investigacionud.repository;

import co.edu.udistrital.investigacionud.model.Cordinator;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CordinatorRepository extends JpaRepository<Cordinator, Cordinator.CordinatorId> {
    Optional<Cordinator> findByCoordinatorId(Integer coordinatorId);
    Optional<Cordinator> findByTeacherId(Integer teacherId);
}

