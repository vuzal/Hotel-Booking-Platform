package com.vusal.azerbook.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.SoftDelete;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@SoftDelete(columnName = "is_active")
@Table(name = "hotels")
public class Hotel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @Column(nullable = false)
    String name;

    @Column(columnDefinition = "Text", nullable = false)
    String description;

    @Column(nullable = false)
    String city;

    @Column(nullable = false)
    String address;

    @Column(nullable = false)
    Double rating;

    @Column(name = "is_active",nullable = false)
    Boolean isActive;

    @UpdateTimestamp
    @Column(name = "updated_at")
    LocalDateTime updatedAt;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    LocalDateTime createdAt;

    @OneToMany(mappedBy = "hotel")
    List<Room> rooms;

    @OneToMany(mappedBy = "hotel")
    List<Review> reviews;

    @OneToMany(mappedBy = "hotel")
    List<Image> images;

}
