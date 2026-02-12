package com.mamadou.hospital_management_system.service;

import com.mamadou.hospital_management_system.dto.DashboardResponse;
import com.mamadou.hospital_management_system.enums.BookingStatus;
import com.mamadou.hospital_management_system.model.Patient;
import com.mamadou.hospital_management_system.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final PatientRepository patientRepository;
    private final AppointmentRepository appointmentRepository;
    private final DoctorRepository doctorRepository;
    private final DepartmentRepository departmentRepository;
    private final RecordRepository recordRepository;

    public DashboardResponse getDashboardData() {
        // Doctor Stats
        long totalDoctors = doctorRepository.count();
        long activeDoctors = doctorRepository.countByIsAvailable(true);
        long shiftOngoing = 2; // Mock or calculate from schedules

        // Patient Stats
        long totalPatients = patientRepository.count();
        long inpatients = patientRepository.countByStatus("Inpatient");
        double growth = 24.0; // Mock

        // Appointment Stats
        long totalAppointments = appointmentRepository.count();
        long upcoming = appointmentRepository.countByStatus(BookingStatus.BOOKED);
        long completed = appointmentRepository.countByStatus(BookingStatus.COMPLETED);

        // Arrival Data (Mocking last 8 months)
        List<DashboardResponse.ArrivalData> arrivalData = List.of(
            new DashboardResponse.ArrivalData("Jan", 15, 12),
            new DashboardResponse.ArrivalData("Feb", 22, 18),
            new DashboardResponse.ArrivalData("Mar", 25, 20),
            new DashboardResponse.ArrivalData("Apr", 35, 21),
            new DashboardResponse.ArrivalData("May", 28, 19),
            new DashboardResponse.ArrivalData("Jun", 22, 17),
            new DashboardResponse.ArrivalData("Jul", 26, 20),
            new DashboardResponse.ArrivalData("Aug", 24, 18)
        );

        
        String[] colors = {"#056B3A", "#F8C244", "#FF7D7D", "#3B82F6", "#8B5CF6"};
        List<DashboardResponse.DepartmentData> departmentData = departmentRepository.findAll().stream()
            .map(dept -> {
                long patientCount = appointmentRepository.countDistinctPatientByDoctorDepartment(dept);
                int colorIndex = (dept.getId() - 1) % colors.length;
                return new DashboardResponse.DepartmentData(dept.getName(), patientCount, colors[colorIndex]);
            })
            .collect(Collectors.toList());

        // If no departments, provide mock
        if (departmentData.isEmpty()) {
            departmentData = List.of(
                new DashboardResponse.DepartmentData("Cardiology", 400, "#056B3A"),
                new DashboardResponse.DepartmentData("Neurology", 300, "#F8C244"),
                new DashboardResponse.DepartmentData("Pediatrics", 300, "#FF7D7D"),
                new DashboardResponse.DepartmentData("Orthopedics", 200, "#3B82F6")
            );
        }

        // Recent Patients
        List<Patient> recentPatientsRaw = patientRepository.findTop5ByOrderByIdDesc();
        List<DashboardResponse.PatientInfo> recentPatients = recentPatientsRaw.stream()
            .map(p -> new DashboardResponse.PatientInfo(
                p.getId(),
                p.getUser() != null ? p.getUser().getFirstName() + " " + p.getUser().getLastName() : "Unknown",
                p.getAge(),
                p.getMedicalRecords() != null && !p.getMedicalRecords().isEmpty() ? p.getMedicalRecords().get(0).getDiagnosis() : "N/A",
                p.getStatus() != null ? p.getStatus() : "Active",
                "20" + (int)(Math.random() * 9 + 1) // Mock room
            ))
            .collect(Collectors.toList());

        return new DashboardResponse(
            new DashboardResponse.DoctorStats(totalDoctors, activeDoctors, shiftOngoing),
            new DashboardResponse.PatientStats(totalPatients, growth, inpatients),
            new DashboardResponse.AppointmentStats(totalAppointments, upcoming, completed),
            arrivalData,
            departmentData,
            recentPatients
        );
    }
}
