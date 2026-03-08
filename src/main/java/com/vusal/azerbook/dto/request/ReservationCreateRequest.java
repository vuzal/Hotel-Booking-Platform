package com.vusal.azerbook.dto.request;

import jakarta.validation.constraints.*;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ReservationCreateRequest {

    @NotNull(message = "Room id is required")
    Long roomId;

    @NotNull(message = "Hotel id is required")
    Long hotelId;

    @NotNull(message = "Check-in date is required")
    @FutureOrPresent(message = "Check-in date cannot be in the past")
    LocalDate checkIn;

    @NotNull(message = "Check-out date is required")
    @Future(message = "Check-out date must be in the future")
    LocalDate checkOut;

    @NotNull(message = "Guest count is required")
    @Min(value = 1, message = "Guest count must be at least 1")
    @Max(value = 10, message = "Guest count cannot exceed 10")
    Integer guestCount;

}
