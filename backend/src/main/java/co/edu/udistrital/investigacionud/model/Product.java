package co.edu.udistrital.investigacionud.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "Product")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Product {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "product_id")
    private Integer productId;
    
    @Column(name = "investigation_project_id", nullable = false)
    private Integer investigationProjectId;
    
    @Column(name = "type_product_id", nullable = false)
    private Integer typeProductId;
    
    @Column(name = "title", nullable = false)
    private String title;
    
    @Column(name = "document", nullable = false)
    private String document;
    
    @Column(name = "public_date", nullable = false)
    private LocalDate publicDate;
    
    @ManyToOne
    @JoinColumn(name = "investigation_project_id", insertable = false, updatable = false)
    private InvestigationProject investigationProject;
    
    @ManyToOne
    @JoinColumn(name = "type_product_id", insertable = false, updatable = false)
    private ProductType productType;
    
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL)
    private List<ProductStudent> productStudents;
    
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL)
    private List<ProductTeacher> productTeachers;
}

