package com.vusal.azerbook.service;

import com.vusal.azerbook.dto.request.RoomCreateRequest;
import com.vusal.azerbook.dto.response.RoomResponse;

import java.util.List;

public interface RoomService {

    RoomResponse create(RoomCreateRequest request);

    RoomResponse getById(Long id);

    List<RoomResponse> getByHotelId(Long hotelId);

    RoomResponse update(Long id, RoomCreateRequest request);

    void delete(Long id);
}
