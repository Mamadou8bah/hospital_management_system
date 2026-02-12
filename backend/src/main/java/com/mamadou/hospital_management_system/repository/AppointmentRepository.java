package com.mamadou.hospital_management_system.repository;

import com.mamadou.hospital_management_system.enums.BookingStatus;
import com.mamadou.hospital_management_system.model.Appointment;
import com.mamadou.hospital_management_system.model.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment,Long> {
    long countByStatus(BookingStatus status);

    @Query("SELECT COUNT(DISTINCT a.patient) FROM Appointment a WHERE a.doctor.department = :department")
    long countDistinctPatientByDoctorDepartment(@Param("department") Department department);
}
