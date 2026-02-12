package com.mamadou.hospital_management_system.model;

import com.mamadou.hospital_management_system.enums.BookingStatus;
import jakarta.persistence.*;
import lombok.Data;



import java.time.LocalDateTime;

@Entity
@Data
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Patient patient;

    @ManyToOne
    private Doctor doctor;

    @ManyToOne
    private DoctorSchedule doctorSchedule;

    @Enumerated(EnumType.STRING)
    private BookingStatus status;

    private String reason;
    private String visitType; // Consultation, Follow-up, etc.
    private LocalDateTime appointmentDate;
}
