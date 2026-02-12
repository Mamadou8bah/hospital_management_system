package com.mamadou.hospital_management_system.controller;

import com.mamadou.hospital_management_system.dto.*;
import com.mamadou.hospital_management_system.model.Doctor;
import com.mamadou.hospital_management_system.service.DoctorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/doctors")
@RequiredArgsConstructor
public class DoctorController {

    private final DoctorService doctorService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MessageResponse> addDoctor(@RequestBody AddDoctorRequest request) {
        try{
            return  ResponseEntity.ok().body(doctorService.addDoctor(request));
        }catch (RuntimeException e){
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping
    public ResponseEntity<List<DoctorDetailResponse>> getAllDoctors() {
        try{
            return ResponseEntity.ok().body(doctorService.findAllDoctors());
        }catch (RuntimeException e){
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<DoctorDetailResponse> getDoctorById(@PathVariable int id) {
        try{
            return ResponseEntity.ok(doctorService.getDoctorById(id));
        }catch (RuntimeException e){
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/of-the-month")
    public ResponseEntity<DoctorOfTheMonthResponse> getDoctorOfTheMonth() {
        try {
            return ResponseEntity.ok(doctorService.getDoctorOfTheMonth());
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MessageResponse> updateDoctor(@PathVariable int id, @RequestBody UpdateDoctorRequest request) {
        try {
            return ResponseEntity.ok(doctorService.updateDoctor(id, request));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
}
