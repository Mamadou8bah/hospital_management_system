package com.mamadou.hospital_management_system.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record ContactRequest(
    @NotBlank(message = "Name is required") String name,
    @NotBlank(message = "Role is required") String role,
    @NotBlank(message = "Phone is required") String phone,
    @Email(message = "Invalid email format") @NotBlank(message = "Email is required") String email,
    @NotBlank(message = "Type is required") String type,
    String location
) {}
