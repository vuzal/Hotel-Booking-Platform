package com.vusal.azerbook.service;

import com.vusal.azerbook.model.request.ReservationCreateRequest;
import com.vusal.azerbook.model.response.ReservationResponse;

import java.time.LocalDate;
import java.util.List;

public interface ReservationService {

    ReservationResponse create(ReservationCreateRequest request, Long userId);

    List<ReservationResponse> getAll();

    List<ReservationResponse> getByUserId(Long userId);

    ReservationResponse getById(Long id);

    ReservationResponse cancel(Long id,Long currentUserId);

    ReservationResponse complete(Long id);

    Boolean isRoomAvailable(Long roomId, LocalDate checkIn, LocalDate checkOut);
}
