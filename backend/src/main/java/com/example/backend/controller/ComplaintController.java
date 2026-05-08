package com.example.backend.controller;

import com.example.backend.dto.ComplaintRequest;
import com.example.backend.model.Complaint;
import com.example.backend.repository.ComplaintRepository;
import com.example.backend.repository.OrderRepository;
import com.example.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/complaints")
@CrossOrigin(origins = "*")
public class ComplaintController {

    @Autowired
    private ComplaintRepository complaintRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OrderRepository orderRepository;

    @GetMapping
    public List<Complaint> getAllComplaints() {
        return complaintRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<?> createComplaint(@Valid @RequestBody ComplaintRequest request) {
        if (userRepository.findById(request.getUserId()).isEmpty()) {
            return ResponseEntity.badRequest().body("Invalid user");
        }
        if (request.getOrderId() != null && orderRepository.findById(request.getOrderId()).isEmpty()) {
            return ResponseEntity.badRequest().body("Invalid order");
        }
        Complaint complaint = new Complaint();
        complaint.setUserId(request.getUserId());
        complaint.setOrderId(request.getOrderId());
        complaint.setSubject(request.getSubject());
        complaint.setMessage(request.getMessage());
        complaint.setStatus("OPEN");
        complaint.setCreatedAt(LocalDateTime.now());
        return ResponseEntity.ok(complaintRepository.save(complaint));
    }
}
