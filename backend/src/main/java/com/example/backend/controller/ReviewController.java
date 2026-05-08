package com.example.backend.controller;

import com.example.backend.dto.ReviewRequest;
import com.example.backend.model.Review;
import com.example.backend.repository.ProductRepository;
import com.example.backend.repository.ReviewRepository;
import com.example.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "*")
public class ReviewController {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/product/{productId}")
    public List<Review> getProductReviews(@PathVariable Long productId) {
        return reviewRepository.findByProductIdOrderByCreatedAtDesc(productId);
    }

    @PostMapping
    public ResponseEntity<?> createReview(@Valid @RequestBody ReviewRequest request) {
        if (productRepository.findById(request.getProductId()).isEmpty()) {
            return ResponseEntity.badRequest().body("Invalid product");
        }
        if (userRepository.findById(request.getUserId()).isEmpty()) {
            return ResponseEntity.badRequest().body("Invalid user");
        }
        Review review = new Review();
        review.setProductId(request.getProductId());
        review.setUserId(request.getUserId());
        review.setRating(request.getRating());
        review.setComment(request.getComment());
        review.setCreatedAt(LocalDateTime.now());
        return ResponseEntity.ok(reviewRepository.save(review));
    }
}
