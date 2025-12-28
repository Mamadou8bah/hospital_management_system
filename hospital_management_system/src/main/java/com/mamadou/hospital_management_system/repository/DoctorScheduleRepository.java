package com.mamadou.hospital_management_system.repository;

import com.mamadou.hospital_management_system.model.DoctorSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DoctorScheduleRepository extends JpaRepository<DoctorSchedule,Long> {
}
