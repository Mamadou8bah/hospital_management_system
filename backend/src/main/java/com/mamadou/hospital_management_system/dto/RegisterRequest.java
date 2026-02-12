package com.mamadou.hospital_management_system.dto;

import com.mamadou.hospital_management_system.enums.Role;
import java.time.LocalDate;

public record RegisterRequest(
        String firstName,
        String lastName,
        String email,
        String password,
        String address,
        LocalDate birthDate,
        Role role
) {
}
