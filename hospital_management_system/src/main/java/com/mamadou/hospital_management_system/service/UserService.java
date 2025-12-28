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

        User user = new User();
        user.setFirstName(request.firstname());
        user.setLastName(request.lastname());
        user.setEmail(request.email());
        user.setPassword(passwordEncoder.encode(request.password()));
        userRepository.save(user);

        return new MessageResponse("Registered successfully");
    }


    public AuthResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() ->
                        new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        String token = jwtService.generateToken(user.getEmail(), Map.of());

        return new AuthResponse(token);
    }
}
