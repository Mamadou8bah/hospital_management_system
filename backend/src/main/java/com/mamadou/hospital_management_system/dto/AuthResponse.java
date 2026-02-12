package com.mamadou.hospital_management_system.dto;

import com.mamadou.hospital_management_system.enums.Role;

public record AuthResponse(String token, Role role) {
}
