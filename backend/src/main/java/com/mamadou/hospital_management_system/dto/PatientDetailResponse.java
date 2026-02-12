package com.mamadou.hospital_management_system.dto;

import java.util.List;

public record PatientDetailResponse(
    long id,
    String firstName,
    String lastName,
    String email,
    String gender,
    String bloodGroup,
    int age,
    double weight,
    double height,
    String phone,
    String address,
    String status,
    String type,
    int pulseRate,
    String bloodPressure,
    int bloodOxygen,
    List<AppointmentDTO> appointments,
    List<MedicalRecordDTO> medicalRecords
) {
    public record AppointmentDTO(Long id, String doctorName, String doctorSpecialty, String date, String status) {}
    public record MedicalRecordDTO(Long id, String diagnosis, String prescription, String date) {}
}
