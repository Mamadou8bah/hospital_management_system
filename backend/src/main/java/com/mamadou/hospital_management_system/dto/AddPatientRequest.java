package com.mamadou.hospital_management_system.dto;

import java.time.LocalDate;

public record AddPatientRequest(
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
        int bloodOxygen
) {}
