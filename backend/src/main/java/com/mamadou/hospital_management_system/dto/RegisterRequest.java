import com.mamadou.hospital_management_system.enums.Role;
import java.time.LocalDate;

public record RegisterRequest(
        String firstname,
        String lastname,
        String email,
        String password,
        String address,
        LocalDate dateOfBirth,
        Role role
) {
}
