package com.example.backend.controller;

import com.example.backend.dto.ProductRequest;
import com.example.backend.model.Product;
import com.example.backend.model.Role;
import com.example.backend.model.User;
import com.example.backend.repository.ProductRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Map;
import java.util.List;
import java.util.Optional;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FileStorageService fileStorageService;

    @GetMapping
    public List<Product> getAllProducts(@RequestParam(required = false) String search) {
        if (search != null && !search.isEmpty()) {
            return productRepository.findByNameContainingIgnoreCase(search);
        }
        return productRepository.findAll();
    }

    @GetMapping("/{id}")
    public Product getProduct(@PathVariable Long id) {
        return productRepository.findById(id).orElse(null);
    }

    @GetMapping("/seller/{sellerId}")
    public List<Product> getSellerProducts(@PathVariable Long sellerId) {
        return productRepository.findBySellerId(sellerId);
    }

    @PostMapping
    public Object createProduct(@Valid @RequestBody ProductRequest request) {
        Optional<User> sellerOpt = userRepository.findById(request.getSellerId());
        if (sellerOpt.isEmpty() || sellerOpt.get().getRole() == null || sellerOpt.get().getRole().getName() != Role.SELLER) {
            return ResponseEntity.badRequest().body("Invalid seller");
        }
        Product product = new Product();
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setCategory(request.getCategory());
        product.setImageUrl(request.getImageUrl());
        product.setTrending(request.isTrending());
        product.setSourcePlatform(request.getSourcePlatform());
        product.setProductUrl(request.getProductUrl());
        product.setSellerId(request.getSellerId());
        product.setStockQuantity(request.getStockQuantity());
        return productRepository.save(product);
    }

    @PutMapping("/{id}")
    public Object updateProduct(@PathVariable Long id, @Valid @RequestBody ProductRequest request) {
        Optional<Product> productOpt = productRepository.findById(id);
        if (productOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Product product = productOpt.get();
        if (product.getSellerId() == null || !product.getSellerId().equals(request.getSellerId())) {
            return ResponseEntity.status(403).body("Seller mismatch");
        }
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setCategory(request.getCategory());
        product.setImageUrl(request.getImageUrl());
        product.setTrending(request.isTrending());
        product.setSourcePlatform(request.getSourcePlatform());
        product.setProductUrl(request.getProductUrl());
        product.setStockQuantity(request.getStockQuantity());
        return productRepository.save(product);
    }

    @PostMapping(value = "/upload-image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadProductImage(@RequestParam("file") MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return ResponseEntity.badRequest().body("File is required");
        }
        if (file.getContentType() == null || !file.getContentType().startsWith("image/")) {
            return ResponseEntity.badRequest().body("Only image files are allowed");
        }
        try {
            String imagePath = fileStorageService.storeProductImage(file);
            return ResponseEntity.ok(Map.of("imageUrl", imagePath));
        } catch (IOException ex) {
            return ResponseEntity.internalServerError().body("Failed to store image");
        }
    }
}
