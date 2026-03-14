package com.vusal.azerbook.model.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.SQLRestriction;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@SQLRestriction("is_active=true")
@Table(name = "hotels")
@Builder
@AllArgsConstructor
@NoArgsConstructor
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

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    Boolean isActive = true;

    @UpdateTimestamp
    @Column(name = "updated_at")
    LocalDateTime updatedAt;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    LocalDateTime createdAt;

    @OneToMany(mappedBy = "hotel")
    @Builder.Default
    List<Room> rooms = new ArrayList<>();

    @OneToMany(mappedBy = "hotel")
    @Builder.Default
    List<Review> reviews = new ArrayList<>();

    @OneToMany(mappedBy = "hotel")
    @Builder.Default
    List<Image> images = new ArrayList<>();

}
