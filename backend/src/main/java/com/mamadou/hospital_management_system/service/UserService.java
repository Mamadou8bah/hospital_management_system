package com.mamadou.hospital_management_system.service;

import com.mamadou.hospital_management_system.dto.AuthResponse;
import com.mamadou.hospital_management_system.dto.LoginRequest;
import com.mamadou.hospital_management_system.dto.MessageResponse;
import com.mamadou.hospital_management_system.dto.RegisterRequest;
import com.mamadou.hospital_management_system.model.User;
import com.mamadou.hospital_management_system.repository.UserRepository;
import com.mamadou.hospital_management_system.security.JwtService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;


@Service
@RequiredArgsConstructor
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtService jwtService;


    public MessageResponse register(RegisterRequest request) {

        if (userRepository.findByEmail(request.email()).isPresent()) {
            return new MessageResponse("Email already in use");
        }

        System.out.println("Register request received");
        User user = new User();
        user.setFirstName(request.firstname());
        user.setLastName(request.lastname());
        user.setEmail(request.email());
        user.setBirthDate(request.dateOfBirth());
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setAddress(request.address());
        user.setRole(request.role());
        System.out.println("Password encoded");

        userRepository.save(user);
        System.out.println("User saved");

        return new MessageResponse("Registered successfully");
    }


    public AuthResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.email())
                .orElse(null);

        if (user == null) {
            System.out.println("Login failed: user not found for email " + request.email());
            throw new RuntimeException("Invalid email or password");
        }

        boolean passwordMatches = passwordEncoder.matches(request.password(), user.getPassword());

        if (!passwordMatches) {
            System.out.println("Login failed: password does not match. Raw: " + request.password() + ", Encoded: " + user.getPassword());
            throw new RuntimeException("Invalid email or password");
        }

        String token = jwtService.generateToken(user.getEmail(), Map.of("role", user.getRole().name()));
        System.out.println("Login successful for user: " + user.getEmail());
        return new AuthResponse(token, user.getRole());
    }
}
