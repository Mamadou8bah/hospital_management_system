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

    String email= getEmail();

    public String getEmail() {
        return (user != null) ? user.getEmail() : null;
    }

    @NotNull
    @Size(min = 1, max = 2)
    private String bloodGroup;

    @OneToMany
    private List<MedicalRecord> medicalRecords;

    @OneToMany
    private List<Appointment> appointments;
}
