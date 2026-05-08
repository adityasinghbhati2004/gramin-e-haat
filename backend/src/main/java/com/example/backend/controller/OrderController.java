package com.example.backend.controller;

import com.example.backend.dto.CreateOrderRequest;
import com.example.backend.dto.OrderItemRequest;
import com.example.backend.model.Order;
import com.example.backend.model.OrderItem;
import com.example.backend.model.Product;
import com.example.backend.model.User;
import com.example.backend.repository.OrderRepository;
import com.example.backend.repository.ProductRepository;
import com.example.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/create")
    public ResponseEntity<?> createOrder(@Valid @RequestBody CreateOrderRequest request) {
        Optional<User> userOpt = userRepository.findById(request.getUserId());
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Invalid user");
        }

        Order order = new Order();
        order.setUserId(request.getUserId());
        order.setOrderDate(LocalDateTime.now());
        order.setPaymentMethod(request.getPaymentMethod());
        order.setShippingAddress(request.getShippingAddress());
        order.setStatus("COD".equalsIgnoreCase(request.getPaymentMethod()) ? "PENDING" : "PAID");

        List<OrderItem> items = new ArrayList<>();
        double total = 0;

        for (OrderItemRequest itemRequest : request.getItems()) {
            Optional<Product> productOpt = productRepository.findById(itemRequest.getProductId());
            if (productOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("Product not found: " + itemRequest.getProductId());
            }
            Product product = productOpt.get();
            int available = product.getStockQuantity() == null ? 0 : product.getStockQuantity();
            if (itemRequest.getQuantity() > available) {
                return ResponseEntity.badRequest().body("Insufficient stock for product: " + product.getName());
            }
            product.setStockQuantity(available - itemRequest.getQuantity());
            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setProduct(product);
            item.setQuantity(itemRequest.getQuantity());
            item.setUnitPrice(product.getPrice());
            items.add(item);
            total += product.getPrice() * itemRequest.getQuantity();
        }

        order.setTotalAmount(total);
        order.setItems(items);

        Order savedOrder = orderRepository.save(order);
        productRepository.saveAll(items.stream().map(OrderItem::getProduct).toList());
        return ResponseEntity.ok(savedOrder);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Order>> getUserOrders(@PathVariable Long userId) {
        return ResponseEntity.ok(orderRepository.findByUserIdOrderByOrderDateDesc(userId));
    }

    @GetMapping("/seller/{sellerId}")
    public ResponseEntity<List<Order>> getSellerOrders(@PathVariable Long sellerId) {
        return ResponseEntity.ok(orderRepository.findBySellerIdOrderByOrderDateDesc(sellerId));
    }
}
