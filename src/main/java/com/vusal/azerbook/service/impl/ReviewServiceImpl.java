package com.vusal.azerbook.service.impl;

import com.vusal.azerbook.exception.ForbiddenException;
import com.vusal.azerbook.exception.NotFoundException;
import com.vusal.azerbook.model.request.ReviewCreateRequest;
import com.vusal.azerbook.model.response.ReviewResponse;
import com.vusal.azerbook.model.entity.Hotel;
import com.vusal.azerbook.model.entity.Review;
import com.vusal.azerbook.model.entity.User;
import com.vusal.azerbook.mapper.EntityMapper;
import com.vusal.azerbook.repository.HotelRepository;
import com.vusal.azerbook.repository.ReviewRepository;
import com.vusal.azerbook.repository.UserRepository;
import com.vusal.azerbook.security.UserDetailsImpl;
import com.vusal.azerbook.service.ReviewService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
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
        User user = userRepository.findById(userId).orElseThrow(() -> new NotFoundException("USER NOT FOUND. userId: "+userId));
        Hotel hotel = hotelRepository.findById(request.getHotelId()).orElseThrow(() -> new NotFoundException("HOTEL NOT FOUND. id: "+request.getHotelId()));

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
    @Transactional
    public void delete(Long id, UserDetailsImpl currentUser) {
        Review review = reviewRepository.findById(id).orElseThrow(() -> new NotFoundException("REVIEW NOT FOUND. id: "+id));

        boolean isOwner=review.getUser().getId().equals(currentUser.getId());
        boolean isAdmin = currentUser.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_ADMIN"));
        if (!isAdmin&&!isOwner){
            throw new ForbiddenException(" YOU DON'T HAVE PERMISSION TO DELETE THIS REVIEW!");
        }
        review.setIsActive(false);
        reviewRepository.save(review);
        updateHotelRating(review.getHotel());
    }
}
