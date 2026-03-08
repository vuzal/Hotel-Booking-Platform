package com.vusal.azerbook.service;

import com.vusal.azerbook.dto.request.ReservationCreateRequest;
import com.vusal.azerbook.dto.response.ReservationResponse;

import java.time.LocalDate;
import java.util.List;

public interface ReservationService {

    ReservationResponse create(ReservationCreateRequest request, Long userId);

    List<ReservationResponse> getByUserId(Long userId);

    ReservationResponse getById(Long id);

    void cancel(Long id);

    void complete(Long id);

    Boolean isRoomAvailable(Long roomId, LocalDate checkIn, LocalDate checkOut);
}
