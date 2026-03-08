package com.vusal.azerbook.service;

import com.vusal.azerbook.dto.request.HotelCreateRequest;
import com.vusal.azerbook.dto.response.HotelDetailResponse;
import com.vusal.azerbook.dto.response.HotelResponse;

import java.util.List;

public interface HotelService {

    HotelResponse create(HotelCreateRequest request);

    List<HotelResponse> getAll();

    HotelDetailResponse getById(Long id);

    List<HotelResponse> getByCity(String city);

    List<HotelResponse> searchByName(String name);

    HotelResponse update(Long id, HotelCreateRequest request);

    void delete(Long id);
}
