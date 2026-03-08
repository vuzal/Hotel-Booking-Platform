package com.vusal.azerbook.mapper;

import com.vusal.azerbook.dto.response.*;
import com.vusal.azerbook.entity.*;
import org.springframework.stereotype.Component;

@Component
public class EntityMapperImpl implements EntityMapper {

    @Override
    public UserResponse toUserResponse(User user) {
        if (user == null) {
            return null;
        }

        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .phone(user.getPhone())
                .role(user.getRole())
                .createdAt(user.getCreatedAt())
                .build();
    }

    @Override
    public RoomResponse toRoomResponse(Room room) {
        if (room == null) {
            return null;
        }

        return RoomResponse.builder()
                .id(room.getId())
                .name(room.getName())
                .type(room.getType())
                .price(room.getPrice())
                .capacity(room.getCapacity())
                .createdAt(room.getCreatedAt())
                .updatedAt(room.getUpdatedAt())
                .build();
    }

    @Override
    public ReviewResponse toReviewResponse(Review review) {
        if (review == null) {
            return null;
        }

        return ReviewResponse.builder()
                .id(review.getId())
                .userName(review.getUser().getFirstName() + " " + review.getUser().getLastName())
                .rating(review.getRating())
                .comment(review.getComment())
                .createdAt(review.getCreatedAt())
                .updatedAt(review.getUpdatedAt())
                .build();
    }

    @Override
    public ReservationResponse toReservationResponse(Reservation reservation) {
        if (reservation == null) {
            return null;
        }

        return ReservationResponse.builder()
                .id(reservation.getId())
                .hotelName(reservation.getHotel().getName())
                .roomName(reservation.getRoom().getName())
                .checkIn(reservation.getCheckIn())
                .checkOut(reservation.getCheckOut())
                .totalPrice(reservation.getTotalPrice())
                .status(reservation.getStatus())
                .guestCount(reservation.getGuestCount())
                .createdAt(reservation.getCreatedAt())
                .updatedAt(reservation.getUpdatedAt())
                .build();
    }

    @Override
    public PaymentResponse toPaymentResponse(Payment payment) {
        if (payment == null) {
            return null;
        }

        return PaymentResponse.builder()
                .id(payment.getId())
                .amount(payment.getAmount())
                .method(payment.getMethod())
                .status(payment.getStatus())
                .createdAt(payment.getCreatedAt())
                .updatedAt(payment.getUpdatedAt())
                .build();
    }

    @Override
    public ImageResponse toImageResponse(Image image) {
        if (image == null) {
            return null;
        }

        return ImageResponse.builder()
                .id(image.getId())
                .url(image.getUrl())
                .isMain(image.getIsMain())
                .createdAt(image.getCreatedAt())
                .updatedAt(image.getUpdatedAt())
                .build();
    }

    @Override
    public HotelResponse toHotelResponse(Hotel hotel) {
        if (hotel == null) {
            return null;
        }

        return HotelResponse.builder()
                .id(hotel.getId())
                .name(hotel.getName())
                .address(hotel.getAddress())
                .city(hotel.getCity())
                .rating(hotel.getRating())
                .mainImageUrl(hotel.getImages().stream()
                        .filter(Image::getIsMain)
                        .findFirst()
                        .map(Image::getUrl)
                        .orElse(null))
                .build();
    }

    @Override
    public HotelDetailResponse toHotelDetailResponse(Hotel hotel) {
        if (hotel == null) {
            return null;
        }
        return HotelDetailResponse.builder()
                .id(hotel.getId())
                .name(hotel.getName())
                .description(hotel.getDescription())
                .address(hotel.getAddress())

                .city(hotel.getCity())
                .rating(hotel.getRating())
                .images(hotel.getImages().stream()
                        .map(image -> {
                            return ImageResponse.builder()
                                    .id(image.getId())
                                    .url(image.getUrl())
                                    .isMain(image.getIsMain())
                                    .build();
                        }).toList())
                .rooms(hotel.getRooms().stream()
                        .map(room -> {
                            return RoomResponse.builder()
                                    .id(room.getId())
                                    .name(room.getName())
                                    .price(room.getPrice())
                                    .capacity(room.getCapacity())
                                    .build();
                        }).toList())
                .reviews(hotel.getReviews().stream()
                        .map(review -> {
                            return ReviewResponse.builder()
                                    .id(review.getId())
                                    .userName(review.getUser().getFirstName() + " " + review.getUser().getLastName())
                                    .rating(review.getRating())
                                    .comment(review.getComment())
                                    .createdAt(review.getCreatedAt())
                                    .build();
                        }).toList())
                .build();
    }
}
