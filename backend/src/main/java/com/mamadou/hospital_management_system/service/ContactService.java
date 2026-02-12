package com.mamadou.hospital_management_system.service;

import com.mamadou.hospital_management_system.dto.ContactRequest;
import com.mamadou.hospital_management_system.dto.MessageResponse;
import com.mamadou.hospital_management_system.model.Contact;
import com.mamadou.hospital_management_system.repository.ContactRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ContactService {
    private final ContactRepository contactRepository;

    public List<Contact> getAllContacts() {
        return contactRepository.findAll();
    }

    public Contact getContactById(Long id) {
        return contactRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Contact not found"));
    }

    @Transactional
    public MessageResponse addContact(ContactRequest request) {
        Contact contact = new Contact();
        mapRequestToEntity(request, contact);
        contactRepository.save(contact);
        return new MessageResponse("Contact added successfully");
    }

    @Transactional
    public MessageResponse updateContact(Long id, ContactRequest request) {
        Contact contact = contactRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Contact not found"));
        mapRequestToEntity(request, contact);
        contactRepository.save(contact);
        return new MessageResponse("Contact updated successfully");
    }

    @Transactional
    public MessageResponse deleteContact(Long id) {
        if (!contactRepository.existsById(id)) {
            throw new RuntimeException("Contact not found");
        }
        contactRepository.deleteById(id);
        return new MessageResponse("Contact deleted successfully");
    }

    public List<Contact> searchContacts(String query) {
        return contactRepository.findByNameContainingIgnoreCaseOrRoleContainingIgnoreCase(query, query);
    }

    private void mapRequestToEntity(ContactRequest request, Contact contact) {
        contact.setName(request.name());
        contact.setRole(request.role());
        contact.setPhone(request.phone());
        contact.setEmail(request.email());
        contact.setType(request.type());
        contact.setLocation(request.location());
    }
}
