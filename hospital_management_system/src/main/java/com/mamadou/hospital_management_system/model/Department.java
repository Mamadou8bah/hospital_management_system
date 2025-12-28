package com.mamadou.hospital_management_system.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.List;

@Entity
@Data
public class Department {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private short id;
    @NotBlank
    private String name;

    @OneToMany
    private List<Doctor> doctors;
}
