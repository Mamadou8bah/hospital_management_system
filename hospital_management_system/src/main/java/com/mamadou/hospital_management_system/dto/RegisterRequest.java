package com.mamadou.hospital_management_system.dto;

import java.time.LocalDate;

public record RegisterRequest(
        String firstname,
        String lastname,
        String email,
        String password,
        LocalDate dateOfBirth
) {
}
