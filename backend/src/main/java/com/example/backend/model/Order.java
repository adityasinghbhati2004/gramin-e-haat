package com.example.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId; // The ID of the user who placed the order
    private Double totalAmount;
    private String status; // PENDING, PAID, SHIPPED, DELIVERED
    private String paymentMethod; // e.g. "CARD", "UPI"
    private LocalDateTime orderDate;
    
    // Address snapshot at time of order
    private String shippingAddress;
}
