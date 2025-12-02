package co.edu.udistrital.investigacionud.dto;

import co.edu.udistrital.investigacionud.model.User;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class RegisterRequest {
    
    @NotBlank(message = "El nombre es obligatorio")
    private String name;
    
    @NotBlank(message = "El email es obligatorio")
    @Email(message = "El email debe tener un formato válido")
    @Pattern(regexp = ".*@udistrital\\.edu\\.co$", message = "El email debe ser del dominio @udistrital.edu.co")
    private String email;
    
    @NotBlank(message = "La contraseña es obligatoria")
    private String password;
    
    private User.Role role;
    
    private Integer projectAreaId; // Para estudiantes y coordinadores
}

