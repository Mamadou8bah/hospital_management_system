package com.mamadou.hospital_management_system.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDate;
import java.util.Collection;
import java.util.List;

@Table(name = "users")
@Entity
@Data
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String firstName;
    private String lastName;
    @Email
    @NotNull(message = "Email Cannot be null")
    private String email;

    @NotNull
    @Size(min = 8)
    private String password;

    @NotNull
    private String address;

    @NotNull
    private LocalDate birthDate;

    @CreatedDate
    private LocalDate createdAt;

    @OneToOne(cascade = CascadeType.ALL)
    private Patient patient;


    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of();
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email;
    }
}
