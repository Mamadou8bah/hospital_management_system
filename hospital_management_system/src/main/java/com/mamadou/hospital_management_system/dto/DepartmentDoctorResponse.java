package com.mamadou.hospital_management_system.dto;

public record DepartmentDoctorResponse(
        int id,
        String firstName,
        String lastName,
        String specialty,
        boolean available
) {
}
