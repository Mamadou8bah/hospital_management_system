package com.mamadou.hospital_management_system.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.springframework.data.annotation.CreatedDate;

import java.time.LocalDate;

@Entity
@Data
public class MedicalRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ManyToOne
    private Patient patient;

    @ManyToOne
    private Doctor issuedBy;

    @NotNull
    private String diagnosis;

    private String notes;

    @CreatedDate
    private LocalDate issueDate;

    @ManyToOne
    private Appointment appointment;

    @NotBlank
    private String prescription;
}
