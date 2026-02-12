package com.mamadou.hospital_management_system.dto;

import com.mamadou.hospital_management_system.model.Patient;
import java.util.List;

public record DashboardResponse(
    DoctorStats doctorStats,
    PatientStats patientStats,
    AppointmentStats appointmentStats,
    List<ArrivalData> arrivalData,
    List<DepartmentData> departmentData,
    List<PatientInfo> recentPatients
) {
    public record DoctorStats(long total, long active, long shiftOngoing) {}
    public record PatientStats(long total, double growth, long inpatients) {}
    public record AppointmentStats(long total, long upcoming, long completed) {}
    public record ArrivalData(String month, int in, int out) {}
    public record DepartmentData(String name, long value, String color) {}
    public record PatientInfo(long id, String name, int age, String diagnosis, String status, String room) {}
}
