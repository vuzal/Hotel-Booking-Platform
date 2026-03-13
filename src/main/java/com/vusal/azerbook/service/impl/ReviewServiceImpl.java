package com.vusal.azerbook.service.impl;

import com.vusal.azerbook.model.request.ReviewCreateRequest;
import com.vusal.azerbook.model.response.ReviewResponse;
import com.vusal.azerbook.model.entity.Hotel;
import com.vusal.azerbook.model.entity.Review;
import com.vusal.azerbook.model.entity.User;
import com.vusal.azerbook.mapper.EntityMapper;
import com.vusal.azerbook.repository.HotelRepository;
import com.vusal.azerbook.repository.ReviewRepository;
import com.vusal.azerbook.repository.UserRepository;
import com.vusal.azerbook.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final HotelRepository hotelRepository;
    private final EntityMapper mapper;

    private void updateHotelRating(Hotel hotel) {
        List<Review> activeReviews = reviewRepository.findByHotelId(hotel.getId());

        double avgRating = activeReviews.stream()
                .mapToDouble(Review::getRating)
                .average()
                .orElse(0.0);
        hotel.setRating(Math.round(avgRating * 10.0) / 10.0);
        hotelRepository.save(hotel);
    }

    @Override
    public ReviewResponse create(ReviewCreateRequest request, Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found!"));
        Hotel hotel = hotelRepository.findById(request.getHotelId()).orElseThrow(() -> new RuntimeException("Hotel not found!"));

        Review review = Review.builder()
                .user(user)
                .hotel(hotel)
                .rating(request.getRating())
                .comment(request.getComment())
                .build();

        Review created = reviewRepository.save(review);

        updateHotelRating(hotel);

        return mapper.toReviewResponse(created);
    }

    @Override
    public List<ReviewResponse> getByHotelId(Long hotelId) {
        return reviewRepository.findByHotelId(hotelId).stream()
                .map(mapper::toReviewResponse).toList();
    }

    @Override
    public List<ReviewResponse> getByUserId(Long userId) {
        return reviewRepository.findByUserId(userId)
                .stream().map(mapper::toReviewResponse).toList();
    }

    @Override
    public void delete(Long id) {
        Review review = reviewRepository.findById(id).orElseThrow(() -> new RuntimeException("Review not found!"));
        review.setIsActive(false);
        reviewRepository.save(review);
        updateHotelRating(review.getHotel());
    }
}
