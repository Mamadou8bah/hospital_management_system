package com.mamadou.hospital_management_system.dto;

public record DoctorOfTheMonthResponse(
    int id,
    String name,
    String specialty,
    String phone,
    String email,
    int performance,
    int attendance,
    int patients
) {}
