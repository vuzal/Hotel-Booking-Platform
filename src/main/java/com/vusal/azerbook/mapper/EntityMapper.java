package com.vusal.azerbook.mapper;

import com.vusal.azerbook.dto.response.*;
import com.vusal.azerbook.entity.*;

public interface EntityMapper {

    UserResponse toUserResponse(User user);

    RoomResponse toRoomResponse(Room room);

    ReviewResponse toReviewResponse(Review review);

    ReservationResponse toReservationResponse(Reservation reservation);

    PaymentResponse toPaymentResponse(Payment payment);

    ImageResponse toImageResponse(Image image);

    HotelResponse toHotelResponse(Hotel hotel);

    HotelDetailResponse toHotelDetailResponse(Hotel hotel);

}
