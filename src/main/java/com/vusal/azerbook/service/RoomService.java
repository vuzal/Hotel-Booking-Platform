package com.vusal.azerbook.service;

import com.vusal.azerbook.model.request.RoomCreateRequest;
import com.vusal.azerbook.model.response.RoomResponse;

import java.util.List;

public interface RoomService {

    RoomResponse create(RoomCreateRequest request);

    RoomResponse getById(Long id);

    List<RoomResponse> getByHotelId(Long hotelId);

    RoomResponse update(Long id, RoomCreateRequest request);

    void delete(Long id);
}
