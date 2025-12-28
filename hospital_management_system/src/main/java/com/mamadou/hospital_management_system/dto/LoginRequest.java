package com.mamadou.hospital_management_system.dto;

public record LoginRequest(
        String email,
        String password
) {
}
