package com.mamadou.hospital_management_system.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;


import java.util.List;

@Entity
@Data
public class Patient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @OneToOne
    private User user;

    @NotNull
    private String gender;

    @NotNull
    @Size(min = 1, max = 5)
    private String bloodGroup;

    private int age;
    private double weight;
    private double height;
    private String phone;
    private String address;
    private String status; // Inpatient, Outpatient

    private String type; // Diagnosis brief
    private int pulseRate;
    private String bloodPressure;
    private int bloodOxygen;

    @org.hibernate.annotations.CreationTimestamp
    private java.time.LocalDateTime createdAt;

    @OneToMany(mappedBy = "patient")
    private List<MedicalRecord> medicalRecords;

    @OneToMany(mappedBy = "patient")
    private List<Appointment> appointments;
}
