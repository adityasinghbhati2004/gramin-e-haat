package com.example.backend.dto;

import com.example.backend.model.Role;
import lombok.Data;

@Data
public class UserResponse {
    private Long id;
    private String email;
    private String name;
    private String address;
    private String phone;
    private Role role;
    private boolean sellerVerified;
    private String govIdUrl;
}
