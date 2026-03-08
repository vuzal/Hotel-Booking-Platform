package com.vusal.azerbook.dto.response;

import com.vusal.azerbook.enums.ReservationStatus;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class ReservationResponse {

    Long id;
    String hotelName;
    String roomName;
    LocalDate checkIn;
    LocalDate checkOut;
    BigDecimal totalPrice;
    ReservationStatus status;
    Integer guestCount;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;


}
