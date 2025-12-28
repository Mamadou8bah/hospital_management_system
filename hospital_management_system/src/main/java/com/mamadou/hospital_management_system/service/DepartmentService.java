package com.mamadou.hospital_management_system.service;

import com.mamadou.hospital_management_system.dto.MessageResponse;
import com.mamadou.hospital_management_system.model.Department;
import com.mamadou.hospital_management_system.repository.DepartmentRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class DepartmentService {
    private final DepartmentRepository departmentRepository;

    public MessageResponse addDepartment(String departmentName) {
        Department department = new Department();
        department.setDepartmentName(departmentName);
        departmentRepository.save(department);
        return new MessageResponse(departmentName+" Department Added");
    }
    public MessageResponse updateDepartment(String departmentName, short id) {
        Department department = new Department();
        department.setDepartmentName(departmentName);
        departmentRepository.save(department);
        return new MessageResponse(departmentName+" Department Updated");
    }
    public MessageResponse deleteDepartment(short id) {
        Department department = departmentRepository.findById(id).orElse(null);
        if (department == null) {
            return new MessageResponse("Department Not Found");
        }
        departmentRepository.deleteById(id);
        return new MessageResponse("Department Deleted");
    }
    public List<Department> getAllDepartments() {
        return departmentRepository.findAll();
    }
    public Department getDepartmentById(short id) {
        return departmentRepository.findById(id).orElse(null);
    }
}
