package com.vusal.azerbook.repository;

import com.vusal.azerbook.entity.Hotel;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HotelRepository extends JpaRepository<Hotel, Long> {
}
