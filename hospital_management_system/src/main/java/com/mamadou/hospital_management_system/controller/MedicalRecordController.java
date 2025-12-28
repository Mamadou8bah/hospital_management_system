package com.mamadou.hospital_management_system.controller;

import com.mamadou.hospital_management_system.dto.MedicalRecordDTO;
import com.mamadou.hospital_management_system.dto.MedicalRecordResponse;
import com.mamadou.hospital_management_system.model.MedicalRecord;
import com.mamadou.hospital_management_system.service.MedicalRecordService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/records")
@RequiredArgsConstructor
public class MedicalRecordController {

    private final MedicalRecordService medicalRecordService;

    @PostMapping
    public ResponseEntity<Object> addMedicalRecord(@RequestBody MedicalRecordDTO dto){
        try{
            return ResponseEntity.ok(medicalRecordService.addMedicalRecord(dto));
        }catch (RuntimeException e){
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{patientId}")
    public ResponseEntity<List<MedicalRecordResponse>> getMedicalRecordByPatient(@PathVariable long patientId){
        try{
            return ResponseEntity.ok(medicalRecordService.getRecordsByPatient(patientId));
        }catch (RuntimeException e){
            return ResponseEntity.badRequest().build();
        }
    }
    @GetMapping("/{doctorId}")
    public ResponseEntity<List<MedicalRecordResponse>> getMedicalRecordByDoctor(@PathVariable int doctorId){
        try{
            return ResponseEntity.ok(medicalRecordService.getRecordsByDoctor(doctorId));
        }catch (RuntimeException e){
            return ResponseEntity.badRequest().build();
        }
    }
}
