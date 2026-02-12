package com.mamadou.hospital_management_system.dto;

import com.mamadou.hospital_management_system.enums.BookingStatus;
import java.time.LocalDateTime;

public record AppointmentResponse(
    Long id,
    Long patientId,
    String patientName,
    int doctorId,
    String doctorName,
    String doctorSpecialty,
    LocalDateTime appointmentDate,
    String visitType,
    BookingStatus status,
    String reason
) {}
