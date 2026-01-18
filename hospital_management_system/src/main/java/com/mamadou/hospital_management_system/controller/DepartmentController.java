package com.mamadou.hospital_management_system.controller;

import com.mamadou.hospital_management_system.dto.DepartmentDoctorResponse;
import com.mamadou.hospital_management_system.dto.DepartmentRequest;
import com.mamadou.hospital_management_system.dto.DepartmentResponse;
import com.mamadou.hospital_management_system.dto.MessageResponse;
import com.mamadou.hospital_management_system.model.Department;
import com.mamadou.hospital_management_system.service.DepartmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping({"/api/department", "/api/departments"})
@RequiredArgsConstructor
@Validated
public class DepartmentController {

    private final DepartmentService departmentService;

    @PostMapping
    public ResponseEntity<?> addDepartment(@RequestBody @Validated DepartmentRequest request) {
        try {
            DepartmentResponse created = departmentService.createDepartment(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(new MessageResponse(e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getDepartment(@PathVariable short id) {
        try {
            return ResponseEntity.ok(departmentService.getDepartmentById(id));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new MessageResponse(e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<List<DepartmentResponse>> getAllDepartments() {
        return ResponseEntity.ok(departmentService.getAllDepartments());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateDepartment(@PathVariable short id, @RequestBody @Validated DepartmentRequest request) {
        try {
            return ResponseEntity.ok(departmentService.updateDepartment(id, request));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new MessageResponse(e.getMessage()));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(new MessageResponse(e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDepartment(@PathVariable short id) {
        try {
            return ResponseEntity.ok(departmentService.deleteDepartment(id));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new MessageResponse(e.getMessage()));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(new MessageResponse(e.getMessage()));
        }
    }

    @GetMapping("/{id}/doctors")
    public ResponseEntity<?> getDoctorsForDepartment(@PathVariable short id) {
        try {
            List<DepartmentDoctorResponse> doctors = departmentService.getDoctorsByDepartment(id);
            return ResponseEntity.ok(doctors);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new MessageResponse(e.getMessage()));
        }
    }
}
