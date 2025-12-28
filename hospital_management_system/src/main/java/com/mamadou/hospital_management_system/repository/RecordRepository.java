package com.mamadou.hospital_management_system.repository;

import com.mamadou.hospital_management_system.model.Doctor;
import com.mamadou.hospital_management_system.model.MedicalRecord;
import com.mamadou.hospital_management_system.model.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RecordRepository extends JpaRepository<MedicalRecord,Long> {

    Optional<MedicalRecord>findByPatient(Patient patient);
    Optional<MedicalRecord> findByIssuedBy(Doctor doctor);
}
