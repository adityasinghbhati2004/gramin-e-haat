package com.example.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ComplaintRequest {
    @NotNull
    private Long userId;

    private Long orderId;

    @NotBlank
    private String subject;

    @NotBlank
    private String message;
}
