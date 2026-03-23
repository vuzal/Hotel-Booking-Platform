package com.vusal.azerbook.repository;

import com.vusal.azerbook.model.entity.Hotel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HotelRepository extends JpaRepository<Hotel, Long> {

    List<Hotel> findByCityContainingIgnoreCase(String city);

    List<Hotel> findByNameIgnoreCase(String name);

    Long countByCity(String city);
}
