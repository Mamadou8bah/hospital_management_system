package com.mamadou.hospital_management_system.dto;

import java.time.LocalDate;

public record MedicalRecordResponse(
        Long id,
        Long patientId,
        Long doctorId,
        String diagnosis,
        String notes,
        LocalDate issueDate,
        Long appointmentId,
        String prescription
) {}
