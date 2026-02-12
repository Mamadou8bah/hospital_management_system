package com.mamadou.hospital_management_system.service;

import com.mamadou.hospital_management_system.dto.AddPatientRequest;
import com.mamadou.hospital_management_system.dto.MessageResponse;
import com.mamadou.hospital_management_system.dto.PatientDetailResponse;
import com.mamadou.hospital_management_system.model.Patient;
import com.mamadou.hospital_management_system.model.User;
import com.mamadou.hospital_management_system.repository.PatientRepository;
import com.mamadou.hospital_management_system.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.TextStyle;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class PatientService {

    private final PatientRepository patientRepository;
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public PatientStatsResponse getPatientStats() {
        List<Patient> allPatients = patientRepository.findAll();

        // Age Stats
        long child = allPatients.stream().filter(p -> p.getAge() <= 12).count();
        long teen = allPatients.stream().filter(p -> p.getAge() > 12 && p.getAge() <= 19).count();
        long adult = allPatients.stream().filter(p -> p.getAge() > 19 && p.getAge() <= 59).count();
        long older = allPatients.stream().filter(p -> p.getAge() > 59).count();
        PatientStatsResponse.AgeStats ageStats = new PatientStatsResponse.AgeStats(child, teen, adult, older);

        // Summary Data (Last 6 months)
        Map<String, List<Patient>> patientsByMonth = allPatients.stream()
                .filter(p -> p.getCreatedAt() != null)
                .collect(Collectors.groupingBy(p -> p.getCreatedAt().getMonth().getDisplayName(TextStyle.SHORT, Locale.ENGLISH)));

        String[] months = {"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"};
        List<PatientStatsResponse.SummaryData> summaryData = new ArrayList<>();
        
        // Get last 6 months
        LocalDate now = LocalDate.now();
        for (int i = 5; i >= 0; i--) {
            String monthName = now.minusMonths(i).getMonth().getDisplayName(TextStyle.SHORT, Locale.ENGLISH);
            List<Patient> monthPatients = patientsByMonth.getOrDefault(monthName, Collections.emptyList());
            
            long in = monthPatients.stream().filter(p -> "Inpatient".equalsIgnoreCase(p.getStatus())).count();
            long out = monthPatients.stream().filter(p -> "Outpatient".equalsIgnoreCase(p.getStatus())).count();
            long dis = monthPatients.stream().filter(p -> "Discharged".equalsIgnoreCase(p.getStatus())).count();
            
            summaryData.add(new PatientStatsResponse.SummaryData(monthName, in, out, dis));
        }

        // Diagnosis Data
        Map<String, Long> diagnosisCounts = allPatients.stream()
                .filter(p -> p.getType() != null)
                .collect(Collectors.groupingBy(Patient::getType, Collectors.counting()));

        List<PatientStatsResponse.DiagnosisData> diagnosisData = diagnosisCounts.entrySet().stream()
                .map(entry -> new PatientStatsResponse.DiagnosisData(entry.getKey(), entry.getValue(), 100))
                .limit(8)
                .collect(Collectors.toList());

        return new PatientStatsResponse(ageStats, summaryData, diagnosisData);
    }

    public MessageResponse addPatient(AddPatientRequest request) {

        User user = userRepository.findByEmail(request.email()).orElse(null);
        if (user == null) {
            user = new User();
            user.setFirstName(request.firstName());
            user.setLastName(request.lastName());
            user.setEmail(request.email());
            user.setPassword(passwordEncoder.encode("PatientPassword123!"));
            user.setAddress(request.address());
            user.setBirthDate(LocalDate.now().minusYears(request.age())); // Approximate birth date from age
            user.setRole(com.mamadou.hospital_management_system.enums.Role.PATIENT);
            userRepository.save(user);
        }

        Patient newPatient = new Patient();
        newPatient.setGender(request.gender());
        newPatient.setUser(user);
        newPatient.setBloodGroup(request.bloodGroup());
        newPatient.setAge(request.age());
        newPatient.setWeight(request.weight());
        newPatient.setHeight(request.height());
        newPatient.setPhone(request.phone());
        newPatient.setAddress(request.address());
        newPatient.setStatus(request.status() != null ? request.status() : "Outpatient");
        newPatient.setType(request.type());
        newPatient.setPulseRate(request.pulseRate());
        newPatient.setBloodPressure(request.bloodPressure());
        newPatient.setBloodOxygen(request.bloodOxygen());

        patientRepository.save(newPatient);
        return new MessageResponse("Patient Added");
    }

    public MessageResponse updatePatient(long id, AddPatientRequest request) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        User user = patient.getUser();
        if (user != null) {
            user.setFirstName(request.firstName());
            user.setLastName(request.lastName());
            user.setEmail(request.email());
            user.setAddress(request.address());
            user.setBirthDate(LocalDate.now().minusYears(request.age()));
            userRepository.save(user);
        }

        patient.setGender(request.gender());
        patient.setBloodGroup(request.bloodGroup());
        patient.setAge(request.age());
        patient.setWeight(request.weight());
        patient.setHeight(request.height());
        patient.setPhone(request.phone());
        patient.setAddress(request.address());
        patient.setStatus(request.status());
        patient.setType(request.type());
        patient.setPulseRate(request.pulseRate());
        patient.setBloodPressure(request.bloodPressure());
        patient.setBloodOxygen(request.bloodOxygen());

        patientRepository.save(patient);
        return new MessageResponse("Patient Updated");
    }

    public MessageResponse deletePatient(String email) {
        Patient patient = patientRepository.findByUserEmail(email).orElse(null);
        if (patient == null) {
            return new MessageResponse("No Patient with Such Email");
        }
        patientRepository.delete(patient);
        return new MessageResponse("Patient Deleted");
    }

    public MessageResponse deletePatientById(long id) {
        if (!patientRepository.existsById(id)) {
            throw new RuntimeException("Patient not found");
        }
        patientRepository.deleteById(id);
        return new MessageResponse("Patient Deleted");
    }

    public List<PatientDetailResponse> getAllPatients() {
        return patientRepository.findAll()
            .stream()
            .map(p -> new PatientDetailResponse(
                p.getId(),
                p.getUser().getFirstName(),
                p.getUser().getLastName(),
                p.getUser().getEmail(),
                p.getGender(),
                p.getBloodGroup(),
                p.getAge(),
                p.getWeight(),
                p.getHeight(),
                p.getPhone(),
                p.getAddress(),
                p.getStatus(),
                p.getType(),
                p.getPulseRate(),
                p.getBloodPressure(),
                p.getBloodOxygen(),
                null,
                null
            ))
            .collect(Collectors.toList());
    }

    public PatientDetailResponse getPatientById(long id) {
        Patient p = patientRepository.findById(id).orElseThrow(() -> new RuntimeException("Patient not found"));
        
        List<PatientDetailResponse.AppointmentDTO> appointments = p.getAppointments().stream()
            .map(a -> new PatientDetailResponse.AppointmentDTO(
                a.getId(),
                a.getDoctor().getUser().getFirstName() + " " + a.getDoctor().getUser().getLastName(),
                a.getDoctor().getSpecialty(),
                a.getAppointmentDate().toString(),
                a.getStatus().name()
            ))
            .collect(Collectors.toList());

        List<PatientDetailResponse.MedicalRecordDTO> records = p.getMedicalRecords().stream()
            .map(r -> new PatientDetailResponse.MedicalRecordDTO(
                r.getId(),
                r.getDiagnosis(),
                r.getPrescription(),
                r.getCreatedAt().toString()
            ))
            .collect(Collectors.toList());

        return new PatientDetailResponse(
            p.getId(),
            p.getUser().getFirstName(),
            p.getUser().getLastName(),
            p.getUser().getEmail(),
            p.getGender(),
            p.getBloodGroup(),
            p.getAge(),
            p.getWeight(),
            p.getHeight(),
            p.getPhone(),
            p.getAddress(),
            p.getStatus(),
            p.getType(),
            p.getPulseRate(),
            p.getBloodPressure(),
            p.getBloodOxygen(),
            appointments,
            records
        );
    }

    public MessageResponse updatePatient(long id,AddPatientRequest  request) {
        User user=userRepository.findByEmail(request.email()).orElse(null);
        if(user==null){
            return new MessageResponse("No User with Such Email");
        }
        Patient patient=patientRepository.findById(id).orElse(null);
        if(patient==null){
            return new MessageResponse("Patient Not Found");
        }
        patient.setGender(request.gender());
        patient.setUser(user);
        patient.setBloodGroup(request.bloodGroup());
        patient.setAge(request.age());
        patient.setWeight(request.weight());
        patient.setHeight(request.height());
        patient.setPhone(request.phone());
        patient.setAddress(request.address());
        patient.setStatus(request.status());
        patient.setType(request.type());
        patient.setPulseRate(request.pulseRate());
        patient.setBloodPressure(request.bloodPressure());
        patient.setBloodOxygen(request.bloodOxygen());
        
        patientRepository.save(patient);
        return new MessageResponse("Patient Updated");
    }
}
