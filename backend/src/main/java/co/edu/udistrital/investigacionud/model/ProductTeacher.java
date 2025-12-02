package co.edu.udistrital.investigacionud.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "Product_teacher")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductTeacher {
    
    @EmbeddedId
    private ProductTeacherId id;
    
    @Column(name = "product_id", insertable = false, updatable = false)
    private Integer productId;
    
    @Column(name = "teacher_id", insertable = false, updatable = false)
    private Integer teacherId;
    
    @ManyToOne
    @JoinColumn(name = "product_id", insertable = false, updatable = false)
    private Product product;
    
    @ManyToOne
    @JoinColumn(name = "teacher_id", insertable = false, updatable = false)
    private Teacher teacher;
    
    @Embeddable
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProductTeacherId implements java.io.Serializable {
        @Column(name = "product_id")
        private Integer productId;
        
        @Column(name = "teacher_id")
        private Integer teacherId;
    }
}

