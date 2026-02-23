package com.vusal.azerbook.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;


import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @NotBlank(message = "Email is required")
    @Column(unique = true, nullable = false)
    @Email(message = "Invalid email format")
    String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    String password;

    @NotBlank(message = "First name is required")
    @Column(name = "first_name")
    String firstName;

    @NotBlank(message = "Last name is required")
    @Column(name = "last_name")
    String lastName;

    @NotBlank(message = "Phone is required")
    @Pattern(regexp = "^(?:\\+994|0)(50|51|55|70|77|99|10|60)\\d{7}$")
    String phone;

    @NotBlank(message = "Role is required")
    @Pattern(regexp = "USER|ADMIN", message = "Role must be USER or ADMIN")
    String role;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    LocalDateTime createdAt;

    @OneToMany(mappedBy = "user")
    List<Reservation> reservations;

    @OneToMany(mappedBy = "user")
    List<Review> reviews;
}
