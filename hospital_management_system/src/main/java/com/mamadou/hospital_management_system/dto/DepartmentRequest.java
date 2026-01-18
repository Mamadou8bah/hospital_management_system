package com.mamadou.hospital_management_system.dto;

import jakarta.validation.constraints.NotBlank;

public record DepartmentRequest(
        @NotBlank(message = "Department name is required")
        String name
) {
}
