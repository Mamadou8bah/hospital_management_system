package com.mamadou.hospital_management_system.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Entity
@Data
public class Doctor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @OneToOne
    private User user;

    private String email= user.getEmail();

    @NotNull
    private String specialty;

    @ManyToOne
    private Department department;

    private boolean isAvailable;

    @OneToMany
    private List<Appointment> appointments;

    @OneToMany
    private List<MedicalRecord> records;
}
