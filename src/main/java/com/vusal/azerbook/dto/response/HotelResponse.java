package com.vusal.azerbook.dto.response;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class HotelResponse {
    Long id;
    String name;
    String city;
    String address;
    Double rating;
    String mainImageUrl;

}
