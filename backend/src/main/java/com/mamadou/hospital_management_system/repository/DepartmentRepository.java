package com.mamadou.hospital_management_system.repository;

import com.mamadou.hospital_management_system.model.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DepartmentRepository extends JpaRepository<Department,Short> {

    Optional<Department> findByName(String name);
}
