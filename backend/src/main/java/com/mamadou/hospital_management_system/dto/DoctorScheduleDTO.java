package com.mamadou.hospital_management_system.dto;

import java.time.DayOfWeek;
import java.time.LocalTime;

public record DoctorScheduleDTO(
        int doctorId,
        int availableSlots,
        DayOfWeek dayOfWeek,
        LocalTime startTime,
        LocalTime endTime
) {}

