package com.mamadou.hospital_management_system.controller;

import com.mamadou.hospital_management_system.dto.AddDoctorRequest;
import com.mamadou.hospital_management_system.dto.DoctorInfo;
import com.mamadou.hospital_management_system.dto.MessageResponse;
import com.mamadou.hospital_management_system.model.Doctor;
import com.mamadou.hospital_management_system.service.DoctorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctors")
@RequiredArgsConstructor
public class DoctorController {

    private final DoctorService doctorService;

    @PostMapping
    public ResponseEntity<MessageResponse> addDoctor(AddDoctorRequest request) {
        try{
            return  ResponseEntity.ok().body(doctorService.addDoctor(request));
        }catch (RuntimeException e){
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping
    public ResponseEntity<List<DoctorInfo>> getAllDoctors() {
        try{
            return ResponseEntity.ok().body(doctorService.findAllDoctors());
        }catch (RuntimeException e){
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> getDoctorById(@PathVariable int id) {
        try{
            return ResponseEntity.ok(doctorService.getDoctorById(id));
        }catch (RuntimeException e){
            return ResponseEntity.badRequest().build();
        }
    }
}
