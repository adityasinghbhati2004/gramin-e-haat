package com.example.backend;

import com.example.backend.model.Role;
import com.example.backend.model.User;
import com.example.backend.model.UserRole;
import com.example.backend.repository.UserRepository;
import com.example.backend.repository.UserRoleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

	@Bean
	public CommandLineRunner seedDatabase(
			UserRepository userRepository,
			UserRoleRepository userRoleRepository,
			PasswordEncoder passwordEncoder) {
		return args -> {
			System.out.println("==================================================");
			System.out.println("   GRAMIN E-HAAT BAZAR: TEST ACCOUNT SETUP        ");
			System.out.println("==================================================");

			// Resolve or create role
			UserRole sellerRole = userRoleRepository.findByName(Role.SELLER).orElseGet(() -> {
				UserRole role = new UserRole();
				role.setName(Role.SELLER);
				return userRoleRepository.save(role);
			});

			UserRole buyerRole = userRoleRepository.findByName(Role.BUYER).orElseGet(() -> {
				UserRole role = new UserRole();
				role.setName(Role.BUYER);
				return userRoleRepository.save(role);
			});

			UserRole adminRole = userRoleRepository.findByName(Role.ADMIN).orElseGet(() -> {
				UserRole role = new UserRole();
				role.setName(Role.ADMIN);
				return userRoleRepository.save(role);
			});

			// Seed/Repair artisan1@graminehaat.com
			userRepository.findByEmail("artisan1@graminehaat.com").ifPresentOrElse(
				user -> {
					user.setPassword(passwordEncoder.encode("password123"));
					user.setRole(sellerRole);
					user.setVerified(true);
					user.setSellerVerified(true);
					userRepository.save(user);
					System.out.println("-> Updated artisan1@graminehaat.com with password: password123");
				},
				() -> {
					User user = new User();
					user.setEmail("artisan1@graminehaat.com");
					user.setPassword(passwordEncoder.encode("password123"));
					user.setName("Rajesh Handicrafts");
					user.setAddress("Jaipur, Rajasthan");
					user.setPhone("8888888881");
					user.setRole(sellerRole);
					user.setVerified(true);
					user.setSellerVerified(true);
					userRepository.save(user);
					System.out.println("-> Created artisan1@graminehaat.com with password: password123");
				}
			);

			// Seed/Repair seller@graminehaat.com
			userRepository.findByEmail("seller@graminehaat.com").ifPresentOrElse(
				user -> {
					user.setPassword(passwordEncoder.encode("password123"));
					user.setRole(sellerRole);
					user.setVerified(true);
					user.setSellerVerified(true);
					userRepository.save(user);
					System.out.println("-> Updated seller@graminehaat.com with password: password123");
				},
				() -> {
					User user = new User();
					user.setEmail("seller@graminehaat.com");
					user.setPassword(passwordEncoder.encode("password123"));
					user.setName("General Artisan Seller");
					user.setAddress("Varanasi, Uttar Pradesh");
					user.setPhone("8888888880");
					user.setRole(sellerRole);
					user.setVerified(true);
					user.setSellerVerified(true);
					userRepository.save(user);
					System.out.println("-> Created seller@graminehaat.com with password: password123");
				}
			);

			// Seed/Repair buyer@graminehaat.com
			userRepository.findByEmail("buyer@graminehaat.com").ifPresentOrElse(
				user -> {
					user.setPassword(passwordEncoder.encode("password123"));
					user.setRole(buyerRole);
					user.setVerified(true);
					userRepository.save(user);
					System.out.println("-> Updated buyer@graminehaat.com with password: password123");
				},
				() -> {
					User user = new User();
					user.setEmail("buyer@graminehaat.com");
					user.setPassword(passwordEncoder.encode("password123"));
					user.setName("Test Buyer");
					user.setAddress("Mumbai, Maharashtra");
					user.setPhone("7777777777");
					user.setRole(buyerRole);
					user.setVerified(true);
					userRepository.save(user);
					System.out.println("-> Created buyer@graminehaat.com with password: password123");
				}
			);

			System.out.println("==================================================");
			System.out.println("   AUTO-SEEDING COMPLETED SUCCESSFULLY           ");
			System.out.println("==================================================");
		};
	}
}

