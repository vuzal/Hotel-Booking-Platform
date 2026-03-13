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
    List<RoomResponse> rooms;
    List<ReviewResponse> reviews;
    List<ImageResponse> images;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
}
