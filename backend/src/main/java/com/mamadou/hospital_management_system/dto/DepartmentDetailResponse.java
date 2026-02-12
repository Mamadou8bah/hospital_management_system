package com.mamadou.hospital_management_system.dto;

import java.util.List;

public record DepartmentDetailResponse(
    long id,
    String name,
    String description,
    String icon,
    String headOfDepartment,
    int doctorCount,
    int patientCount,
    List<DoctorInfo> doctors
) {
    public record DoctorInfo(int id, String name, String specialty) {}
}
