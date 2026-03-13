package com.vusal.azerbook.mapper;

import com.vusal.azerbook.model.entity.*;
import com.vusal.azerbook.model.response.*;

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
