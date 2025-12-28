package com.mamadou.hospital_management_system.controller;

import com.mamadou.hospital_management_system.model.Department;
import com.mamadou.hospital_management_system.service.DepartmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/department")
@RequiredArgsConstructor
public class DepartmentController {

    private final DepartmentService departmentService;

    @PostMapping
    public ResponseEntity<Object> addDepartment(@RequestBody String departmentName) {
        try{
            return ResponseEntity.ok(departmentService.addDepartment(departmentName));
        }catch(Exception e){
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> getDepartment(@PathVariable short id) {
        try{
            return ResponseEntity.ok(departmentService.getDepartmentById(id));
        }catch(Exception e){
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping
        public ResponseEntity<List<Department>> getAllDepartments() {
        try{
            return ResponseEntity.ok().body(departmentService.getAllDepartments());
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
