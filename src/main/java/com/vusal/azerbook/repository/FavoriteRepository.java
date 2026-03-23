package com.vusal.azerbook.repository;

import com.vusal.azerbook.model.entity.Favorite;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FavoriteRepository  extends JpaRepository<Favorite, Long> {

    List<Favorite> findByUserId(Long id);
    Optional<Favorite> findByUserIdAndHotelId(Long userId, Long hotelId);
    Boolean existsByUserIdAndHotelId(Long userId, Long hotelId);
    void deleteByUserIdAndHotelId(Long userId,Long hotelId);

}
