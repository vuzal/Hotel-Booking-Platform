package com.vusal.azerbook.repository;

import com.vusal.azerbook.model.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;

public interface RoomRepository extends JpaRepository<Room, Long> {

    List<Room> findByHotelId(Long hotelId);

    @Query("SELECT min (r.price) FROM Room r WHERE r.hotel.id = :hotelId AND r.isActive = true")
    BigDecimal findMinPriceByHotelId(@Param("hotelId") Long hotelId);
}
