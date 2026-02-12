package com.mamadou.hospital_management_system.dto;

public record UpdateDoctorRequest(
    String specialty,
    String phone,
    String about,
    boolean isAvailable,
    String departmentName,
    boolean isDoctorOfTheMonth
) {}
