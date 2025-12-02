package co.edu.udistrital.investigacionud.repository;

import co.edu.udistrital.investigacionud.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {
    List<Product> findByInvestigationProjectId(Integer investigationProjectId);
}

