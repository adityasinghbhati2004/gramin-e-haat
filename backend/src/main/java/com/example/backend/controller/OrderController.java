package com.example.backend.controller;

import com.example.backend.model.Order;
import com.example.backend.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @PostMapping("/create")
    public ResponseEntity<?> createOrder(@RequestBody Order order) {
        order.setOrderDate(LocalDateTime.now());
        // Simulating Payment Gateway processing success
        order.setStatus("PAID"); 
        
        Order savedOrder = orderRepository.save(order);
        
        // Return simulated Payment Gateway confirmation and Order ID
        return ResponseEntity.ok(savedOrder);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Order>> getUserOrders(@PathVariable Long userId) {
        return ResponseEntity.ok(orderRepository.findByUserIdOrderByOrderDateDesc(userId));
    }
}
