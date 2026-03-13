package com.vusal.azerbook.repository;

import com.vusal.azerbook.model.entity.Image;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ImageRepository extends JpaRepository<Image, Long> {

    List<Image> findByHotelId(Long hotelId);

    Optional<Image> findByHotelIdAndIsMainTrue(Long hotelId);
}
