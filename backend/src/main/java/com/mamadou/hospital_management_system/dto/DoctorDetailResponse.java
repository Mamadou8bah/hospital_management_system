package com.mamadou.hospital_management_system.dto;

import java.util.List;

public record DoctorDetailResponse(
    int id,
    String firstName,
    String lastName,
    String email,
    String specialty,
    String departmentName,
    String phone,
    String about,
    double rating,
    boolean isAvailable,
    int experienceYears,
    int patientsCount,
    String workingHours,
    List<AppointmentDTO> recentAppointments
) {
    public record AppointmentDTO(Long id, String patientName, String date, String status, String reason) {}
}
