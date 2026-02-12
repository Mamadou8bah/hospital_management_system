package com.mamadou.hospital_management_system.repository;

import com.mamadou.hospital_management_system.model.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PatientRepository extends JpaRepository<Patient,Long> {
    Optional<Patient> findByUserEmail(String email);
    long countByStatus(String status);
    List<Patient> findTop5ByOrderByIdDesc();
}
