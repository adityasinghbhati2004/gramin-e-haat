package com.example.backend.controller;

import com.example.backend.dto.AdminUserUpdateRequest;
import com.example.backend.dto.UserResponse;
import com.example.backend.model.Role;
import com.example.backend.model.Order;
import com.example.backend.model.UserRole;
import com.example.backend.model.User;
import com.example.backend.repository.ComplaintRepository;
import com.example.backend.repository.OrderRepository;
import com.example.backend.repository.UserRoleRepository;
import com.example.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ComplaintRepository complaintRepository;

    @Autowired
    private UserRoleRepository userRoleRepository;

    @GetMapping("/users")
    public List<UserResponse> getUsers() {
        return userRepository.findAll().stream().map(this::toUserResponse).toList();
    }

    @GetMapping("/roles")
    public List<String> getRoles() {
        return userRoleRepository.findAll().stream()
            .map(r -> r.getName().name())
            .toList();
    }

    @PatchMapping("/users/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @Valid @RequestBody AdminUserUpdateRequest request) {
        return userRepository.findById(id)
            .map(user -> {
                if (request.getRole() != null) {
                    UserRole newRole = userRoleRepository.findByName(request.getRole()).orElse(null);
                    if (newRole == null) {
                        return ResponseEntity.badRequest().body("Invalid role value");
                    }
                    user.setRole(newRole);
                }
                if (request.getSellerVerified() != null) {
                    user.setSellerVerified(request.getSellerVerified());
                }
                User saved = userRepository.save(user);
                return ResponseEntity.ok(toUserResponse(saved));
            })
            .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/orders")
    public List<Order> getOrders() {
        return orderRepository.findAll();
    }

    @GetMapping("/complaints")
    public List<?> getComplaints() {
        return complaintRepository.findAll();
    }

    @GetMapping("/summary")
    public Map<String, Object> getSummary() {
        Map<String, Object> summary = new HashMap<>();
        summary.put("users", userRepository.count());
        summary.put("orders", orderRepository.count());
        summary.put("complaints", complaintRepository.count());
        return summary;
    }

    private UserResponse toUserResponse(User user) {
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setEmail(user.getEmail());
        response.setName(user.getName());
        response.setAddress(user.getAddress());
        response.setPhone(user.getPhone());
        response.setRole(user.getRole() == null ? Role.BUYER : user.getRole().getName());
        response.setSellerVerified(user.isSellerVerified());
        return response;
    }
}
