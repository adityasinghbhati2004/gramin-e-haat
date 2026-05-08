package com.example.backend.dto;

import com.example.backend.model.Role;
import lombok.Data;

@Data
public class AdminUserUpdateRequest {
    private Role role;
    private Boolean sellerVerified;
}
