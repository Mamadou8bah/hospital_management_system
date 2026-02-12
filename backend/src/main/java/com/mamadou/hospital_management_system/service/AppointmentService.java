package com.mamadou.hospital_management_system.service;

import com.mamadou.hospital_management_system.dto.BookAppointmentRequest;
import com.mamadou.hospital_management_system.dto.MessageResponse;
import com.mamadou.hospital_management_system.enums.BookingStatus;
import com.mamadou.hospital_management_system.model.Appointment;
import com.mamadou.hospital_management_system.model.Doctor;
import com.mamadou.hospital_management_system.model.DoctorSchedule;
import com.mamadou.hospital_management_system.model.Patient;
import com.mamadou.hospital_management_system.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.mamadou.hospital_management_system.dto.AppointmentResponse;
import com.mamadou.hospital_management_system.dto.BookAppointmentRequest;
import com.mamadou.hospital_management_system.dto.MessageResponse;
import com.mamadou.hospital_management_system.enums.BookingStatus;
import com.mamadou.hospital_management_system.model.Appointment;
import com.mamadou.hospital_management_system.model.Doctor;
import com.mamadou.hospital_management_system.model.DoctorSchedule;
import com.mamadou.hospital_management_system.model.Patient;
import com.mamadou.hospital_management_system.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;
    private final DoctorScheduleRepository doctorScheduleRepository;
    private final UserRepository userRepository;

    public List<AppointmentResponse> getAllAppointments() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        com.mamadou.hospital_management_system.model.User user = userRepository.findByEmail(email).orElse(null);

        if (user != null && user.getRole() == com.mamadou.hospital_management_system.enums.Role.DOCTOR) {
            return appointmentRepository.findAll().stream()
                    .filter(a -> a.getDoctor().getUser().getEmail().equals(email))
                    .map(this::mapToResponse)
                    .collect(Collectors.toList());
        }

        return appointmentRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public AppointmentResponse getAppointmentById(Long id) {
        return appointmentRepository.findById(id)
                .map(this::mapToResponse)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
    }

    public MessageResponse bookAppointment(BookAppointmentRequest request) {
        Doctor doctor = doctorRepository.findById(request.doctorId()).orElseThrow(() -> new RuntimeException("Doctor not found"));
        Patient patient = patientRepository.findById(request.patientId()).orElseThrow(() -> new RuntimeException("Patient not found"));
        
        DoctorSchedule schedule = null;
        if (request.scheduleId() != null) {
            schedule = doctorScheduleRepository.findById(request.scheduleId()).orElse(null);
        }

        Appointment appointment = new Appointment();
        appointment.setPatient(patient);
        appointment.setDoctor(doctor);
        appointment.setDoctorSchedule(schedule);
        appointment.setReason(request.reason());
        appointment.setVisitType(request.visitType() != null ? request.visitType() : "Consultation");
        appointment.setAppointmentDate(request.appointmentDate());
        appointment.setStatus(BookingStatus.BOOKED);
        
        appointmentRepository.save(appointment);
        return new MessageResponse("Appointment booked successfully");
    }

    public MessageResponse updateStatus(Long id, BookingStatus status) {
        Appointment appointment = appointmentRepository.findById(id).orElseThrow(() -> new RuntimeException("Appointment not found"));
        appointment.setStatus(status);
        appointmentRepository.save(appointment);
        return new MessageResponse("Appointment status updated to " + status);
    }

    public MessageResponse cancelAppointment(Long id) {
        return updateStatus(id, BookingStatus.CANCELLED);
    }

    private AppointmentResponse mapToResponse(Appointment a) {
        return new AppointmentResponse(
                a.getId(),
                a.getPatient().getId(),
                a.getPatient().getUser().getFirstName() + " " + a.getPatient().getUser().getLastName(),
                a.getDoctor().getId(),
                a.getDoctor().getUser().getFirstName() + " " + a.getDoctor().getUser().getLastName(),
                a.getDoctor().getSpecialty(),
                a.getAppointmentDate(),
                a.getVisitType(),
                a.getStatus(),
                a.getReason()
        );
    }
}

