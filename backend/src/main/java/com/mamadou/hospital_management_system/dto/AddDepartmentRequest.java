package com.mamadou.hospital_management_system.dto;

import jakarta.validation.constraints.NotBlank;

public record AddDepartmentRequest(
    @NotBlank String name,
    String description,
    String headOfDepartment,
    String icon
) {}
