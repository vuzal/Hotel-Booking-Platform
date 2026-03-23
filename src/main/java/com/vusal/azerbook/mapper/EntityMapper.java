package com.vusal.azerbook.mapper;

import com.vusal.azerbook.model.entity.*;
import com.vusal.azerbook.model.request.HotelCreateRequest;
import com.vusal.azerbook.model.response.*;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface EntityMapper {

    UserResponse toUserResponse(User user);

    @Mapping(target = "hotelId", source = "hotel.id")
    RoomResponse toRoomResponse(Room room);

    @Mapping(
            target = "userName",
            expression = "java(review.getUser() != null ? review.getUser().getFirstName() + \" \" + review.getUser().getLastName() : \"Anonymous\")"
    )
    ReviewResponse toReviewResponse(Review review);

    @Mapping(target = "hotelMainImageUrl", source = "hotel.mainImageUrl")
    @Mapping(target = "hotelName", source = "hotel.name")
    @Mapping(target = "roomName", source = "room.name")
    @Mapping(target = "hotelId", source = "hotel.id")
    @Mapping(target = "guestName", expression = "java(reservation.getUser().getFirstName() + \" \" + reservation.getUser().getLastName())")
    ReservationResponse toReservationResponse(Reservation reservation);

    PaymentResponse toPaymentResponse(Payment payment);

    HotelResponse toHotelResponse(Hotel hotel);

    HotelDetailResponse toHotelDetailResponse(Hotel hotel);

    Hotel toHotelEntity(HotelCreateRequest request);

    @Mapping(source = "hotel.id", target = "hotelId")
    @Mapping(source = "hotel.name", target = "hotelName")
    @Mapping(source = "hotel.mainImageUrl", target = "mainImageUrl")
    @Mapping(source = "hotel.city", target = "city")
    @Mapping(source = "hotel.basePrice", target = "basePrice")
    FavoriteResponse toFavoriteResponse(Favorite favorite);

}
