package com.vusal.azerbook.service;

import com.vusal.azerbook.model.request.HotelCreateRequest;
import com.vusal.azerbook.model.response.HotelDetailResponse;
import com.vusal.azerbook.model.response.HotelResponse;

import java.util.List;
import java.util.Map;

public interface HotelService {

    HotelResponse create(HotelCreateRequest request);

    List<HotelResponse> getAll();

    HotelDetailResponse getById(Long id);

    List<HotelResponse> getByCity(String city);

    Map<String,Long> getCityHotelCounts();

    List<HotelResponse> searchByName(String name);

    HotelResponse update(Long id, HotelCreateRequest request);

    void delete(Long id);
}
