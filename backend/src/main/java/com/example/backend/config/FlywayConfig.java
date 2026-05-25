package com.example.backend.config;

import org.springframework.boot.autoconfigure.flyway.FlywayMigrationStrategy;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FlywayConfig {

    @Bean
    public FlywayMigrationStrategy flywayMigrationStrategy() {
        return flyway -> {
            System.out.println("Running Flyway Repair to self-heal any migration checksum mismatches...");
            flyway.repair();
            System.out.println("Flyway Repair completed. Continuing with migrations...");
            flyway.migrate();
        };
    }
}
