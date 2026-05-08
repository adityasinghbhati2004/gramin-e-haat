package com.example.backend.repository;

import com.example.backend.model.Role;
import com.example.backend.model.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRoleRepository extends JpaRepository<UserRole, Long> {
    Optional<UserRole> findByName(Role name);
}
