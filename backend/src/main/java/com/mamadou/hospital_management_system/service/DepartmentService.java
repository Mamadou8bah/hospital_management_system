package com.mamadou.hospital_management_system.service;

import com.mamadou.hospital_management_system.dto.AddDepartmentRequest;
import com.mamadou.hospital_management_system.dto.DepartmentDetailResponse;
import com.mamadou.hospital_management_system.dto.MessageResponse;
import com.mamadou.hospital_management_system.model.Department;
import com.mamadou.hospital_management_system.repository.DepartmentRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class DepartmentService {
    private final DepartmentRepository departmentRepository;

    public MessageResponse addDepartment(AddDepartmentRequest request) {
        Department department = new Department();
        department.setName(request.name());
        department.setDescription(request.description());
        department.setHeadOfDepartment(request.headOfDepartment());
        department.setIcon(request.icon());
        departmentRepository.save(department);
        return new MessageResponse(request.name()+" Department Added");
    }
    public MessageResponse updateDepartment(AddDepartmentRequest request, short id) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Department not found"));
        department.setName(request.name());
        department.setDescription(request.description());
        department.setHeadOfDepartment(request.headOfDepartment());
        department.setIcon(request.icon());
        departmentRepository.save(department);
        return new MessageResponse(request.name()+" Department Updated");
    }
    public MessageResponse deleteDepartment(short id) {
        Department department = departmentRepository.findById(id).orElse(null);
        if (department == null) {
            return new MessageResponse("Department Not Found");
        }
        departmentRepository.deleteById(id);
        return new MessageResponse("Department Deleted");
    }
    public List<DepartmentDetailResponse> findAllDepartments() {
        return departmentRepository.findAll().stream()
            .map(d -> new DepartmentDetailResponse(
                d.getId(),
                d.getName(),
                d.getDescription(),
                d.getIcon(),
                d.getHeadOfDepartment(),
                d.getDoctors() != null ? d.getDoctors().size() : 0,
                150, // Mock patient count
                d.getDoctors() != null ? d.getDoctors().stream()
                    .map(doc -> new DepartmentDetailResponse.DoctorInfo(
                        doc.getId(),
                        doc.getUser().getFirstName() + " " + doc.getUser().getLastName(),
                        doc.getSpecialty()
                    ))
                    .collect(Collectors.toList()) : List.of()
            ))
            .collect(Collectors.toList());
    }

    public DepartmentDetailResponse getDepartmentDetailById(short id) {
        Department d = departmentRepository.findById(id).orElseThrow(() -> new RuntimeException("Department not found"));
        return new DepartmentDetailResponse(
            d.getId(),
            d.getName(),
            d.getDescription(),
            d.getIcon(),
            d.getHeadOfDepartment(),
            d.getDoctors() != null ? d.getDoctors().size() : 0,
            150,
            d.getDoctors() != null ? d.getDoctors().stream()
                .map(doc -> new DepartmentDetailResponse.DoctorInfo(
                    doc.getId(),
                    doc.getUser().getFirstName() + " " + doc.getUser().getLastName(),
                    doc.getSpecialty()
                ))
                .collect(Collectors.toList()) : List.of()
        );
    }
}
