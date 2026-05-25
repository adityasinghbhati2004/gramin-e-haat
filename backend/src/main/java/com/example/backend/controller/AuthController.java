package com.example.backend.controller;

import com.example.backend.dto.LoginRequest;
import com.example.backend.dto.SignupRequest;
import com.example.backend.dto.UserResponse;
import com.example.backend.dto.VerifyOtpRequest;
import com.example.backend.model.Role;
import com.example.backend.model.User;
import com.example.backend.model.UserRole;
import com.example.backend.repository.UserRoleRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.FileStorageService;
import com.example.backend.service.SmsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.Map;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserRoleRepository userRoleRepository;

    @Autowired
    private FileStorageService fileStorageService;

    @Autowired
    private SmsService smsService;

    private String generateOtp() {
        return String.format("%06d", (int) (Math.random() * 1000000));
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@Valid @RequestBody SignupRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email already exists");
        }
        UserRole userRole = resolveOrCreateRole(request.getRole() != null && request.getRole().equalsIgnoreCase("SELLER") ? Role.SELLER : Role.BUYER);
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setName(request.getName());
        user.setAddress(request.getAddress());
        user.setPhone(request.getPhone());
        user.setRole(userRole);
        user.setSellerVerified(false);
        user.setGovIdUrl(request.getGovIdUrl());
        
        // OTP completely bypassed, set directly to verified
        user.setVerified(true);

        User savedUser = userRepository.save(user);
        return ResponseEntity.ok(toUserResponse(savedUser));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {
        Optional<User> userOpt = userRepository.findByEmail(loginRequest.getEmail());
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (user.getRole() == null) {
                user.setRole(resolveOrCreateRole(Role.BUYER));
                user = userRepository.save(user);
            }
            if (passwordEncoder.matches(loginRequest.getPassword(), user.getPassword()) || user.getPassword().equals(loginRequest.getPassword())) {
                // Ensure user is verified (bypassed)
                if (!user.isVerified()) {
                    user.setVerified(true);
                    user = userRepository.save(user);
                }

                if (user.getPassword().equals(loginRequest.getPassword())) {
                    user.setPassword(passwordEncoder.encode(loginRequest.getPassword()));
                    User migratedUser = userRepository.save(user);
                    return ResponseEntity.ok(toUserResponse(migratedUser));
                }
                return ResponseEntity.ok(toUserResponse(user));
            }
        }
        return ResponseEntity.status(401).body("Invalid credentials");
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@Valid @RequestBody VerifyOtpRequest verifyRequest) {
        Optional<User> userOpt = userRepository.findByEmail(verifyRequest.getEmail());
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found");
        }
        User user = userOpt.get();
        if (user.getOtp() == null || !user.getOtp().equals(verifyRequest.getOtp())) {
            return ResponseEntity.badRequest().body("Invalid OTP");
        }
        if (user.getOtpExpiry() == null || user.getOtpExpiry().isBefore(java.time.LocalDateTime.now())) {
            return ResponseEntity.badRequest().body("OTP has expired");
        }

        // OTP verified successfully
        user.setVerified(true);
        user.setOtp(null);
        user.setOtpExpiry(null);
        User verifiedUser = userRepository.save(user);

        return ResponseEntity.ok(toUserResponse(verifiedUser));
    }

    @PostMapping(value = "/upload-gov-id", consumes = org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadGovId(@RequestParam("file") org.springframework.web.multipart.MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return ResponseEntity.badRequest().body("File is required");
        }
        try {
            String url = fileStorageService.storeGovId(file);
            return ResponseEntity.ok(Map.of("govIdUrl", url));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to store Gov ID");
        }
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
        response.setGovIdUrl(user.getGovIdUrl());
        return response;
    }

    private UserRole resolveOrCreateRole(Role roleName) {
        return userRoleRepository.findByName(roleName).orElseGet(() -> {
            UserRole role = new UserRole();
            role.setName(roleName);
            return userRoleRepository.save(role);
        });
    }
}
