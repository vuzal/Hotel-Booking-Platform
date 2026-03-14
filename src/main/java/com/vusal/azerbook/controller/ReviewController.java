package com.vusal.azerbook.controller;

import com.vusal.azerbook.model.request.ReviewCreateRequest;
import com.vusal.azerbook.model.response.ReviewResponse;
import com.vusal.azerbook.security.CurrentUser;
import com.vusal.azerbook.security.UserDetailsImpl;
import com.vusal.azerbook.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping
    public ResponseEntity<ReviewResponse> create(@Valid @RequestBody ReviewCreateRequest request, @CurrentUser UserDetailsImpl currentUser) {
        return ResponseEntity.status(HttpStatus.CREATED).body(reviewService.create(request, currentUser.getId()));
    }

    @GetMapping("/hotel/{hotelId}")
    public ResponseEntity<List<ReviewResponse>> getHotelReviews(@PathVariable Long hotelId) {
        return ResponseEntity.ok(reviewService.getByHotelId(hotelId));
    }

    @GetMapping("/my")
    public ResponseEntity<List<ReviewResponse>> getMyReviews(@CurrentUser UserDetailsImpl currentUser) {
        return ResponseEntity.ok(reviewService.getByUserId(currentUser.getId()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReview(@PathVariable Long id, @CurrentUser UserDetailsImpl currentUser) {
        reviewService.delete(id, currentUser);
        return ResponseEntity.noContent().build();
    }

}
