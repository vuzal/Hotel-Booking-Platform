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
public class HotelResponse {
    Long id;
    String name;
    String city;
    String address;
    Double rating;
    Integer stars;
    Double basePrice;
    List<String> amenities;
    String mainImageUrl;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;

}
