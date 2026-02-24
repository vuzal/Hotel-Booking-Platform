package com.vusal.azerbook.repository;

import com.vusal.azerbook.entity.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {


}
