package co.edu.udistrital.investigacionud.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "Product_student")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductStudent {
    
    @EmbeddedId
    private ProductStudentId id;
    
    @Column(name = "product_id", insertable = false, updatable = false)
    private Integer productId;
    
    @Column(name = "student_id", insertable = false, updatable = false)
    private Integer studentId;
    
    @ManyToOne
    @JoinColumn(name = "product_id", insertable = false, updatable = false)
    private Product product;
    
    @ManyToOne
    @JoinColumn(name = "student_id", insertable = false, updatable = false)
    private Student student;
    
    @Embeddable
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProductStudentId implements java.io.Serializable {
        @Column(name = "product_id")
        private Integer productId;
        
        @Column(name = "student_id")
        private Integer studentId;
    }
}

