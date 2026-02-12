package com.mamadou.hospital_management_system.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.List;

@Entity
@Data
public class DoctorSchedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "doctor_id")
    private Doctor doctor;

    @OneToMany(mappedBy = "doctorSchedule")
    private List<Appointment> appointments;

    int availableSlots;

    private DayOfWeek dayOfWeek;

    private LocalTime startTime;
    private LocalTime endTime;
}
