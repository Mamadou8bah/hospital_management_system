package com.mamadou.hospital_management_system.controller;

import com.mamadou.hospital_management_system.dto.AddPatientRequest;
import com.mamadou.hospital_management_system.dto.MessageResponse;
import com.mamadou.hospital_management_system.model.Patient;
import com.mamadou.hospital_management_system.service.PatientService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/patients")
@RequiredArgsConstructor
public class PatientController {

    private final PatientService patientService;

    @PostMapping
    public ResponseEntity<MessageResponse> addPatient(@RequestBody AddPatientRequest request) {
        try{
            return ResponseEntity.ok().body(patientService.addPatient(request));
        }catch(RuntimeException e){
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Patient> getPatientById(@RequestParam int id) {
        try{
            return ResponseEntity.ok().body(patientService.getAllPatients().get(id));
        }catch(RuntimeException e){
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllPatients() {
        try{
            return ResponseEntity.ok().body(patientService.getAllPatients());
        }catch(RuntimeException e){
            return ResponseEntity.badRequest().build();
        }
    }



}
