package com.vusal.azerbook.repository;

import com.vusal.azerbook.model.entity.Hotel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HotelRepository extends JpaRepository<Hotel, Long> {

    Page<Hotel> findByCityContainingIgnoreCase(String city, Pageable pageable);

    Page<Hotel> findByNameIgnoreCase(String name, Pageable pageable);

    Long countByCity(String city);
}
