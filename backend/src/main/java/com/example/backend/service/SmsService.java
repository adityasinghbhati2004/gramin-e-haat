package com.example.backend.service;

import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;

@Service
public class SmsService {

    @PostConstruct
    public void init() {
        System.out.println("================================================");
        System.out.println("SmsService initialized (Console Bypass Mode).");
        System.out.println("Twilio is disabled. OTPs will print to console.");
        System.out.println("================================================");
    }

    public void sendOtpSms(String toPhoneNumber, String otp) {
        String msgBody = "Your Gramin E-Haat Bazaar OTP is: " + otp + ". It is valid for 10 minutes.";
        
        System.out.println("\n================================================");
        System.out.println("SMS SENT TO " + toPhoneNumber + ": " + msgBody);
        System.out.println("================================================\n");
    }
}

