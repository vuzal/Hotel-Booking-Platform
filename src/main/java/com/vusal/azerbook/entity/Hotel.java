package com.vusal.azerbook.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "hotels")
public class Hotel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @NotNull(message = "Hotel name is required")
    @Column(nullable = false)
    String name;

    @NotNull(message = "Description is required")
    @Column(columnDefinition = "Text", nullable = false)
    String description;

    @NotNull(message = "City is required")
    @Column(nullable = false)
    String city;

    @NotNull(message = "Address is required")
    String address;

    @Min(value = 1, message = "Rating cannot be 0")
    @Max(value = 10, message = "Rating cannot exceed 10")
    Double rating;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    LocalDateTime createdAt;

    @OneToMany(mappedBy = "hotel")
    List<Room> rooms;

    @OneToMany(mappedBy = "hotel")
    List<Reservation> reservations;

    @OneToMany(mappedBy = "hotel")
    List<Review> reviews;

    @OneToMany(mappedBy = "hotel")
    List<Image> images;

}
