package com.mamadou.hospital_management_system.dto;

public record DepartmentResponse(
        short id,
        String name,
        int doctorCount
) {
}
