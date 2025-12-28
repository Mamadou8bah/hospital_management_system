package com.mamadou.hospital_management_system.dto;

import java.time.LocalDate;

public record AddPatientRequest(
        String email,
        String gender,
        String bloodGroup
) {}
