package com.vusal.azerbook.dto.response;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Data;
import lombok.experimental.FieldDefaults;
import java.time.LocalDateTime;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class HotelResponse {
    Long id;
    String name;
    String city;
    String address;
    Double rating;
    String mainImageUrl;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;

}
