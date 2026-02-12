package com.mamadou.hospital_management_system.controller;

import com.mamadou.hospital_management_system.dto.LoginRequest;
import com.mamadou.hospital_management_system.dto.RegisterRequest;
import com.mamadou.hospital_management_system.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<Object> login(@RequestBody RegisterRequest request) {
        try{
            userService.register(request);
            return ResponseEntity.ok("Register successful");
        }catch(Exception e){
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/login")
    public ResponseEntity<Object> login(@RequestBody LoginRequest request) {
        try{
            return ResponseEntity.ok(userService.login(request));
        }catch(Exception e){
            return ResponseEntity.badRequest().build();
        }
    }
}
