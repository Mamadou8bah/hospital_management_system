package com.mamadou.hospital_management_system.dto;

public record AddDoctorRequest(
        String email,
        String speciality,
        String department
) {
}
