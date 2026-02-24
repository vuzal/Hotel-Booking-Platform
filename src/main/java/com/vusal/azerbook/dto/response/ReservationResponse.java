package com.vusal.azerbook.dto.response;

import com.vusal.azerbook.enums.ReservationStatus;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ReservationResponse {

    Long id;
    String hotelName;
    String roomName;
    LocalDateTime checkIn;
    LocalDateTime checkOut;
    BigDecimal totalPrice;
    ReservationStatus status;
    Integer guestCount;
    LocalDateTime createdAt;


}
