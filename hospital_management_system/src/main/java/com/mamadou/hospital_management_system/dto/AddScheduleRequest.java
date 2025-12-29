package com.mamadou.hospital_management_system.dto;

import java.time.DayOfWeek;
import java.time.LocalTime;

public record AddScheduleRequest(
        int availableSlots,
        DayOfWeek day,
        LocalTime startTime,
        LocalTime endTime
) {
}
