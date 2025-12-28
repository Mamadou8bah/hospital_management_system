package com.mamadou.hospital_management_system.service;

import com.mamadou.hospital_management_system.dto.AddDoctorRequest;
import com.mamadou.hospital_management_system.dto.DoctorInfo;
import com.mamadou.hospital_management_system.dto.MessageResponse;
import com.mamadou.hospital_management_system.model.Department;
import com.mamadou.hospital_management_system.model.Doctor;
import com.mamadou.hospital_management_system.model.User;
import com.mamadou.hospital_management_system.repository.DepartmentRepository;
import com.mamadou.hospital_management_system.repository.DoctorRepository;
import com.mamadou.hospital_management_system.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class DoctorService {

    private final DoctorRepository doctorRepository;
    private final DepartmentRepository departmentRepository;
    private final UserRepository userRepository;

    public MessageResponse addDoctor(AddDoctorRequest addDoctorRequest) {

        User user=userRepository.findByEmail(addDoctorRequest.email()).orElse(null);
        if(user==null){
            return new MessageResponse("User not found");
        }

        Department department=departmentRepository.findByName(addDoctorRequest.department()).orElse(null);
        if(department==null){
            return new MessageResponse("Department not found");
        }
        Doctor doctor = new Doctor();
        doctor.setUser(user);
        doctor.setDepartment(department);
        doctor.setSpecialty(addDoctorRequest.speciality());
        doctorRepository.save(doctor);
        return new MessageResponse("Doctor added");
    }

    public MessageResponse deleteDoctorById(int id) {
        doctorRepository.deleteById(id);
        return new MessageResponse("Doctor deleted");
    }
    public List<DoctorInfo> findAllDoctors() {
        return doctorRepository.findAll()
                .stream()
                .map(doctor -> new DoctorInfo(
                        doctor.getUser().getFirstName(),
                        doctor.getUser().getLastName(),
                        doctor.getSpecialty()
                ))
                .collect(Collectors.toList());
    }

}
