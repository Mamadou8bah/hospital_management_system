package com.mamadou.hospital_management_system.repository;

import com.mamadou.hospital_management_system.model.Contact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContactRepository extends JpaRepository<Contact, Long> {
    List<Contact> findByNameContainingIgnoreCaseOrRoleContainingIgnoreCase(String name, String role);
}
