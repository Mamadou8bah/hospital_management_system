package com.mamadou.hospital_management_system.dto;

import java.time.LocalDate;

public record MedicalRecordDTO(
        Long patientId,
        int doctorId,
        String diagnosis,
        String notes,
        LocalDate issueDate,
        Long appointmentId,
        String prescription
) {}
