package com.mamadou.hospital_management_system.controller;

import com.mamadou.hospital_management_system.dto.AddPatientRequest;
import com.mamadou.hospital_management_system.dto.MessageResponse;
import com.mamadou.hospital_management_system.dto.PatientDetailResponse;
import com.mamadou.hospital_management_system.dto.PatientStatsResponse;
import com.mamadou.hospital_management_system.service.PatientService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/patients")
@RequiredArgsConstructor
public class PatientController {

    private final PatientService patientService;

    @GetMapping("/stats")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST')")
    public ResponseEntity<PatientStatsResponse> getPatientStats() {
        return ResponseEntity.ok(patientService.getPatientStats());
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST')")
    public ResponseEntity<MessageResponse> addPatient(@RequestBody AddPatientRequest request) {
        try{
            return ResponseEntity.ok().body(patientService.addPatient(request));
        }catch(RuntimeException e){
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST', 'DOCTOR')")
    public ResponseEntity<MessageResponse> updatePatient(@PathVariable long id, @RequestBody AddPatientRequest request) {
        try {
            return ResponseEntity.ok(patientService.updatePatient(id, request));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping
    public ResponseEntity<List<PatientDetailResponse>> getAllPatients() {
        return ResponseEntity.ok(patientService.getAllPatients());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PatientDetailResponse> getPatientById(@PathVariable long id) {
        try{
            return ResponseEntity.ok().body(patientService.getPatientById(id));
        }catch(RuntimeException e){
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MessageResponse> deletePatient(@PathVariable long id) {
        try {
            return ResponseEntity.ok(patientService.deletePatientById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
