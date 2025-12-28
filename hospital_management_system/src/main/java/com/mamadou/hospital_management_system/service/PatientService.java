package com.mamadou.hospital_management_system.service;

import com.mamadou.hospital_management_system.dto.AddPatientRequest;
import com.mamadou.hospital_management_system.dto.MessageResponse;
import com.mamadou.hospital_management_system.model.Patient;
import com.mamadou.hospital_management_system.model.User;
import com.mamadou.hospital_management_system.repository.PatientRepository;
import com.mamadou.hospital_management_system.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class PatientService {

    private final PatientRepository patientRepository;

    private final UserRepository userRepository;

    public MessageResponse addPatient(AddPatientRequest  request) {

        User user=userRepository.findByEmail(request.email()).orElse(null);
        if(user==null){
            return new MessageResponse("No User with Such Email");
        }
        Patient newPatient = new Patient();
        newPatient.setGender(request.gender());
        newPatient.setUser(user);
        newPatient.setBloodGroup(request.bloodGroup());

        patientRepository.save(newPatient);
        return new MessageResponse("Patient Added");
    }

    public MessageResponse deletePatient(String email) {
        User user=userRepository.findByEmail(email).orElse(null);
        if(user==null){
            return new MessageResponse("No User with Such Email");
        }
        patientRepository.deleteById(user.getId());
        return new MessageResponse("Patient Deleted");
    }

    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
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
        patientRepository.save(patient);
        return new MessageResponse("Patient Updated");
    }
}
