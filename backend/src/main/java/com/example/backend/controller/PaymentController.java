package com.example.backend.controller;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "*")
public class PaymentController {

    @Value("${razorpay.key.id}")
    private String keyId;

    @Value("${razorpay.key.secret}")
    private String keySecret;

    @GetMapping("/key")
    public ResponseEntity<?> getKey() {
        return ResponseEntity.ok(Map.of("key", keyId));
    }

    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(@RequestBody Map<String, Object> data) {
        try {
            double amountDouble = Double.parseDouble(data.get("amount").toString());
            int amount = (int) (amountDouble * 100); // amount in paise

            if (keyId.startsWith("rzp_test_dummy")) {
                // Mock Razorpay Order for testing without real keys
                return ResponseEntity.ok(Map.of(
                    "id", "order_mock_" + System.currentTimeMillis(),
                    "amount", amount,
                    "currency", "INR"
                ));
            }

            RazorpayClient client = new RazorpayClient(keyId, keySecret);
            JSONObject options = new JSONObject();
            options.put("amount", amount);
            options.put("currency", "INR");
            options.put("receipt", "txn_" + System.currentTimeMillis());

            Order order = client.orders.create(options);
            return ResponseEntity.ok(Map.of(
                "id", order.get("id"),
                "amount", order.get("amount"),
                "currency", order.get("currency")
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error creating Razorpay order: " + e.getMessage());
        }
    }
}
