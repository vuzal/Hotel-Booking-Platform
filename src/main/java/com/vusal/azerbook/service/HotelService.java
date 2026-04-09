package com.vusal.azerbook.service;

import com.vusal.azerbook.model.request.HotelCreateRequest;
import com.vusal.azerbook.model.response.HotelDetailResponse;
import com.vusal.azerbook.model.response.HotelResponse;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.Map;

public interface HotelService {

    HotelResponse create(HotelCreateRequest request);

    Page<HotelResponse> getAll(int page, int size);

    HotelDetailResponse getById(Long id);

    Page<HotelResponse> getByCity(String city, int page, int size);

    Map<String,Long> getCityHotelCounts();

    Page<HotelResponse> searchByName(String name, int page, int size);

    HotelResponse update(Long id, HotelCreateRequest request);

    void delete(Long id);
}
