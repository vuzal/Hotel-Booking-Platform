package com.vusal.azerbook.repository;

import com.vusal.azerbook.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReviewRepository extends JpaRepository<Review, Long> {

}
