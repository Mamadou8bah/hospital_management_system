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

@Service
@Transactional
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;

    private final DoctorRepository doctorRepository;

    private final PatientRepository patientRepository;

    private final DoctorScheduleRepository doctorScheduleRepository;

    public MessageResponse bookAppointment(BookAppointmentRequest bookAppointmentRequest) {
        Doctor doctor=doctorRepository.findById(bookAppointmentRequest.doctorId()).orElse(null);
        if(doctor==null){
            return new MessageResponse("Doctor not found");
        }
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();
        Patient patient= patientRepository.findByEmail(email).orElse(null);

        if(patient==null){
            return new MessageResponse("No Logged in Patient not found");
        }
        DoctorSchedule schedule=doctorScheduleRepository.findById(bookAppointmentRequest.scheduleId()).orElse(null);

        if(schedule==null){
            return new MessageResponse("Doctor Schedule not found");
        }

        Appointment appointment=new Appointment();
        appointment.setPatient(patient);
        appointment.setDoctor(doctor);
        appointment.setDoctorSchedule(schedule);
        appointmentRepository.save(appointment);
        appointment.setStatus(BookingStatus.BOOKED);

        return new MessageResponse("Appointment booked successfully");
    }

    public MessageResponse cancelBookAppointment(long appointmentId) {
        Appointment appointment=appointmentRepository.findById(appointmentId).orElse(null);
        if(appointment==null){
            return new MessageResponse("Appointment not found");
        }
        appointment.setStatus(BookingStatus.CANCELLED);
        appointmentRepository.save(appointment);
        return new MessageResponse("Appointment cancelled successfully");
    }

    public MessageResponse completeBookAppointment(long appointmentId) {
        Appointment appointment=appointmentRepository.findById(appointmentId).orElse(null);
        if(appointment==null){
            return new MessageResponse("Appointment not found");
        }
        appointment.setStatus(BookingStatus.COMPLETED);
        appointmentRepository.save(appointment);
        return new MessageResponse("Appointment completed successfully");
    }
}
