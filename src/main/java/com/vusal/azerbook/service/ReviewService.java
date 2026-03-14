package com.vusal.azerbook.service;

import com.vusal.azerbook.model.request.ReviewCreateRequest;
import com.vusal.azerbook.model.response.ReviewResponse;
import com.vusal.azerbook.security.UserDetailsImpl;

import java.util.List;

public interface ReviewService {
    ReviewResponse create(ReviewCreateRequest request, Long userId);

    List<ReviewResponse> getByHotelId(Long hotelId);

    List<ReviewResponse> getByUserId(Long userId);

    void delete(Long id, UserDetailsImpl currentUser);


}
