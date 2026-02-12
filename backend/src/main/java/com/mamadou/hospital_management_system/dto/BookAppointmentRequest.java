package com.mamadou.hospital_management_system.dto;

import java.time.LocalDateTime;

public record BookAppointmentRequest(
        Long patientId,
        int doctorId,
        Long scheduleId,
        String reason,
        String visitType,
        LocalDateTime appointmentDate
) {
}
