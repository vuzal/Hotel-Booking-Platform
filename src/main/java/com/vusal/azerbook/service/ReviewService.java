package com.vusal.azerbook.service;

import com.vusal.azerbook.dto.request.ReviewCreateRequest;
import com.vusal.azerbook.dto.response.ReviewResponse;

import java.util.List;

public interface ReviewService {
    ReviewResponse create(ReviewCreateRequest request, Long userId);

    List<ReviewResponse> getByHotelId(Long hotelId);

    List<ReviewResponse> getByUserId(Long userId);

    void delete(Long id);


}
