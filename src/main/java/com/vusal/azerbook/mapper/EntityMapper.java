package com.vusal.azerbook.mapper;

import com.vusal.azerbook.model.entity.*;
import com.vusal.azerbook.model.response.*;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface EntityMapper {

    UserResponse toUserResponse(User user);

    RoomResponse toRoomResponse(Room room);

    @Mapping(
            target = "userName",
            expression = "java(review.getUser() != null ? review.getUser().getFirstName() + \" \" + review.getUser().getLastName() : \"Anonymous\")"
    )
    ReviewResponse toReviewResponse(Review review);

    @Mapping(target = "hotelName", source = "hotel.name")
    @Mapping(target = "roomName",  source = "room.name")
    ReservationResponse toReservationResponse(Reservation reservation);

    PaymentResponse toPaymentResponse(Payment payment);

    ImageResponse toImageResponse(Image image);

    @Mapping(
            target = "mainImageUrl",
            expression = "java(hotel.getImages() != null ? hotel.getImages().stream().filter(i -> i.getIsMain()).findFirst().map(i -> i.getUrl()).orElse(null) : null)"
    )
    HotelResponse toHotelResponse(Hotel hotel);

    HotelDetailResponse toHotelDetailResponse(Hotel hotel);

}
