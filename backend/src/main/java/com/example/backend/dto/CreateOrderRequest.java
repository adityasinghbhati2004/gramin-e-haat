package com.example.backend.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.util.List;

@Data
public class CreateOrderRequest {
    @NotNull
    private Long userId;

    @NotBlank
    private String paymentMethod;

    @NotBlank
    private String shippingAddress;

    @NotEmpty
    private List<@Valid OrderItemRequest> items;
}
