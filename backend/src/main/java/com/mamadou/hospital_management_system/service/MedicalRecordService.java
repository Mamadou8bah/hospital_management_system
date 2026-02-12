package com.mamadou.hospital_management_system.service;

import com.mamadou.hospital_management_system.dto.MedicalRecordDTO;
import com.mamadou.hospital_management_system.dto.MedicalRecordResponse;
import com.mamadou.hospital_management_system.model.Appointment;
import com.mamadou.hospital_management_system.model.Doctor;
import com.mamadou.hospital_management_system.model.MedicalRecord;
import com.mamadou.hospital_management_system.model.Patient;
import com.mamadou.hospital_management_system.repository.AppointmentRepository;
import com.mamadou.hospital_management_system.repository.DoctorRepository;
import com.mamadou.hospital_management_system.repository.RecordRepository;
import com.mamadou.hospital_management_system.repository.PatientRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class MedicalRecordService {

    private final RecordRepository medicalRecordRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final AppointmentRepository appointmentRepository;

    // Add a new medical record
    public MedicalRecordResponse addMedicalRecord(MedicalRecordDTO dto) {
        Patient patient = patientRepository.findById(dto.patientId())
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        Doctor doctor = doctorRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        Appointment appointment = null;
        if (dto.appointmentId() != null) {
            appointment = appointmentRepository.findById(dto.appointmentId())
                    .orElseThrow(() -> new RuntimeException("Appointment not found"));
        }

        MedicalRecord record = new MedicalRecord();
        record.setPatient(patient);
        record.setIssuedBy(doctor);
        record.setDiagnosis(dto.diagnosis());
        record.setNotes(dto.notes());
        record.setIssueDate(dto.issueDate() != null ? dto.issueDate() : LocalDate.now());
        record.setAppointment(appointment);
        record.setPrescription(dto.prescription());

        MedicalRecord saved = medicalRecordRepository.save(record);

        return new MedicalRecordResponse(
                saved.getId(),
                saved.getPatient().getId(),
                (long) saved.getIssuedBy().getId(),
                saved.getDiagnosis(),
                saved.getNotes(),
                saved.getIssueDate(),
                saved.getAppointment() != null ? saved.getAppointment().getId() : null,
                saved.getPrescription()
        );
    }

    // Get all records for a patient
    public List<MedicalRecordResponse> getRecordsByPatient(Long patientId) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        return medicalRecordRepository.findByPatient(patient)
                .stream()
                .map(record -> new MedicalRecordResponse(
                        record.getId(),
                        record.getPatient().getId(),
                        (long) record.getIssuedBy().getId(),
                        record.getDiagnosis(),
                        record.getNotes(),
                        record.getIssueDate(),
                        record.getAppointment() != null ? record.getAppointment().getId() : null,
                        record.getPrescription()
                ))
                .collect(Collectors.toList());
    }

    // Optional: Get all records issued by a doctor
    public List<MedicalRecordResponse> getRecordsByDoctor(int doctorId) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        return medicalRecordRepository.findByIssuedBy(doctor)
                .stream()
                .map(record -> new MedicalRecordResponse(
                        record.getId(),
                        record.getPatient().getId(),
                        (long)record.getIssuedBy().getId(),
                        record.getDiagnosis(),
                        record.getNotes(),
                        record.getIssueDate(),
                        record.getAppointment() != null ? record.getAppointment().getId() : null,
                        record.getPrescription()
                ))
                .collect(Collectors.toList());
    }
}
