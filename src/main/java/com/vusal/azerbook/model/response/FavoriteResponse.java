package com.vusal.azerbook.model.response;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Data
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class FavoriteResponse {

    Long id;
    Long userId;
    Long hotelId;
    String hotelName;
    String mainImageUrl;
    String city;
    BigDecimal basePrice;
}
