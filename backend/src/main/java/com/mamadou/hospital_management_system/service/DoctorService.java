package com.mamadou.hospital_management_system.service;

import com.mamadou.hospital_management_system.dto.*;
import com.mamadou.hospital_management_system.model.Department;
import com.mamadou.hospital_management_system.model.Doctor;
import com.mamadou.hospital_management_system.model.User;
import com.mamadou.hospital_management_system.repository.DepartmentRepository;
import com.mamadou.hospital_management_system.repository.DoctorRepository;
import com.mamadou.hospital_management_system.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class DoctorService {

    private final DoctorRepository doctorRepository;
    private final DepartmentRepository departmentRepository;
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public MessageResponse addDoctor(AddDoctorRequest addDoctorRequest) {
        User user = userRepository.findByEmail(addDoctorRequest.email()).orElse(null);
        if (user == null) {
            user = new User();
            user.setFirstName(addDoctorRequest.firstName());
            user.setLastName(addDoctorRequest.lastName());
            user.setEmail(addDoctorRequest.email());
            user.setPassword(passwordEncoder.encode(addDoctorRequest.password() != null ? addDoctorRequest.password() : "Password123!"));
            user.setAddress(addDoctorRequest.address() != null ? addDoctorRequest.address() : "Hospital Campus");
            user.setBirthDate(java.time.LocalDate.of(1990, 1, 1)); // Default or add to request
            user.setRole(com.mamadou.hospital_management_system.enums.Role.DOCTOR);
            userRepository.save(user);
        }

        Department department = departmentRepository.findByName(addDoctorRequest.department()).orElse(null);
        if (department == null) {
            return new MessageResponse("Department not found");
        }

        Doctor doctor = new Doctor();
        doctor.setUser(user);
        doctor.setDepartment(department);
        doctor.setSpecialty(addDoctorRequest.speciality());
        doctor.setPhone(addDoctorRequest.phone());
        doctor.setAbout(addDoctorRequest.about());
        doctor.setAvailable(true);
        doctor.setRating(5.0);
        doctorRepository.save(doctor);
        return new MessageResponse("Doctor added successfully");
    }

    public MessageResponse updateDoctor(int id, UpdateDoctorRequest request) {
        Doctor doctor = doctorRepository.findById(id).orElseThrow(() -> new RuntimeException("Doctor not found"));
        
        if (request.specialty() != null) doctor.setSpecialty(request.specialty());
        if (request.phone() != null) doctor.setPhone(request.phone());
        if (request.about() != null) doctor.setAbout(request.about());
        doctor.setAvailable(request.isAvailable());
        doctor.setDoctorOfTheMonth(request.isDoctorOfTheMonth());

        if (request.departmentName() != null) {
            Department department = departmentRepository.findByName(request.departmentName())
                    .orElseThrow(() -> new RuntimeException("Department not found"));
            doctor.setDepartment(department);
        }

        doctorRepository.save(doctor);
        return new MessageResponse("Doctor updated successfully");
    }

    public MessageResponse deleteDoctorById(int id) {
        doctorRepository.deleteById(id);
        return new MessageResponse("Doctor deleted");
    }

    public DoctorDetailResponse getDoctorById(int id) {
        Doctor doctor = doctorRepository.findById(id).orElseThrow(() -> new RuntimeException("Doctor not found"));
        
        List<DoctorDetailResponse.AppointmentDTO> appointments = doctor.getAppointments().stream()
            .map(a -> new DoctorDetailResponse.AppointmentDTO(
                a.getId(),
                a.getPatient().getUser().getFirstName() + " " + a.getPatient().getUser().getLastName(),
                "2023-12-10", // Mock date
                a.getStatus().name()
            ))
            .limit(5)
            .collect(Collectors.toList());

        return new DoctorDetailResponse(
            doctor.getId(),
            doctor.getUser().getFirstName(),
            doctor.getUser().getLastName(),
            doctor.getUser().getEmail(),
            doctor.getSpecialty(),
            doctor.getDepartment() != null ? doctor.getDepartment().getName() : "General",
            doctor.getPhone(),
            doctor.getAbout(),
            doctor.getRating(),
            doctor.isAvailable(),
            doctor.getExperienceYears(),
            doctor.getPatientsCount(),
            doctor.getWorkingHours(),
            appointments
        );
    }

    public DoctorOfTheMonthResponse getDoctorOfTheMonth() {
        Doctor doctor = doctorRepository.findFirstByIsDoctorOfTheMonthTrue()
                .orElseGet(() -> doctorRepository.findAll().stream().findFirst()
                        .orElseThrow(() -> new RuntimeException("No doctors found")));
        
        // Mocking some stats for now as requested by the frontend design
        return new DoctorOfTheMonthResponse(
            doctor.getId(),
            doctor.getUser().getFirstName() + " " + doctor.getUser().getLastName(),
            doctor.getSpecialty(),
            doctor.getPhone(),
            doctor.getUser().getEmail(),
            31, // Mock performance %
            27, // Mock attendance %
            doctor.getAppointments() != null ? doctor.getAppointments().size() : 32 // Patients
        );
    }

    public List<DoctorDetailResponse> findAllDoctors() {
        return doctorRepository.findAll()
            .stream()
            .map(doctor -> new DoctorDetailResponse(
                doctor.getId(),
                doctor.getUser().getFirstName(),
                doctor.getUser().getLastName(),
                doctor.getUser().getEmail(),
                doctor.getSpecialty(),
                doctor.getDepartment() != null ? doctor.getDepartment().getName() : "General",
                doctor.getPhone(),
                doctor.getAbout(),
                doctor.getRating(),
                doctor.isAvailable(),
                doctor.getExperienceYears(),
                doctor.getPatientsCount(),
                doctor.getWorkingHours(),
                null
            ))
            .collect(Collectors.toList());
    }
}
