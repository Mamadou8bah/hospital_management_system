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

    private String email=getEmail();
    public String getEmail() {
        return (user != null) ? user.getEmail() : null;
    }

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
