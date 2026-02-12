package com.mamadou.hospital_management_system.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Data
@NoArgsConstructor
public class Doctor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @OneToOne
    private User user;

    @NotNull
    private String specialty;

    @ManyToOne
    private Department department;

    private boolean isAvailable;
    private String phone;
    private String about;
    private double rating;
    private boolean isDoctorOfTheMonth;
    private int experienceYears;
    private int patientsCount;
    private String workingHours;

    @org.hibernate.annotations.CreationTimestamp
    private java.time.LocalDateTime createdAt;

    @OneToMany(mappedBy = "doctor")
    private List<Appointment> appointments;

    @OneToMany(mappedBy = "issuedBy")
    private List<MedicalRecord> records;
}
