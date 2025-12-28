package com.mamadou.hospital_management_system.dto;

public record BookAppointmentRequest(
        int doctorId,
        Long scheduleId,
        String reason
) {
}
