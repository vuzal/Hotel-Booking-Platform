package com.vusal.azerbook.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class HotelCreateRequest {
    @NotNull(message = "Name is required")
    String name;

    @NotNull(message = "Description is required")
    String description;

    @NotNull(message = "City is required")
    String city;

    @NotNull(message = "Address is required")
    String address;

}
