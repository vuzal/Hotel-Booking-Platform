package com.vusal.azerbook.dto.response;

import com.vusal.azerbook.entity.Image;
import com.vusal.azerbook.entity.Review;
import com.vusal.azerbook.entity.Room;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class HotelDetailResponse {

    Long id;
    String name;
    String description;
    String  city;
    String address;
    Double rating;
    List<Room> rooms;
    List<Review> reviews;
    List<Image> images;
}
