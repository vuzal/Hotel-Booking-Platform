package com.vusal.azerbook.model.response;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class HotelDetailResponse {

    Long id;
    String name;
    String description;
    String  city;
    String address;
    Double rating;
    Integer stars;
    Double basePrice;
    String mainImageUrl;
    List<RoomResponse> rooms;
    List<ReviewResponse> reviews;
    List<String> amenities;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
}
