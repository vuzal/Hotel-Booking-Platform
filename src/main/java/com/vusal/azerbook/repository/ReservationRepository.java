package com.vusal.azerbook.repository;

import com.vusal.azerbook.model.entity.Reservation;
import com.vusal.azerbook.enums.ReservationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    @Query("Select r From Reservation r where r.room.id = :roomId AND r.status !=:cancelledStatus and (r.checkIn<:checkOut and r.checkOut>:checkIn)")
    List<Reservation> findConflictingReservations(@Param("roomId") Long roomId, @Param("checkIn") LocalDate checkIn, @Param("checkOut") LocalDate checkOut, @Param("cancelledStatus") ReservationStatus cancelledStatus);

    List<Reservation> findByUserId(Long userId);
}
