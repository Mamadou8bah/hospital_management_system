package com.mamadou.hospital_management_system.dto;

public record AddDoctorRequest(
        String firstName,
        String lastName,
        String email,
        String password,
        String speciality,
        String department,
        String phone,
        String about,
        String address
) {
}
