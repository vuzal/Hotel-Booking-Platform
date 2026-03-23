package com.vusal.azerbook.model.request;

import jakarta.validation.constraints.*;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.util.List;

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

    @NotNull(message = "Rating is required")
    Double rating;

    @NotNull(message = "Image url is required")
    String mainImageUrl;

    @NotNull(message = "The star rating must be specified. ⭐")
    @Min(value = 1, message = "The minimum rating can be 1 star. ⭐")
    @Max(value = 5, message = "The maximum rating can be 5 stars. ⭐")
    Integer stars;

    @NotNull(message = "The base price must be specified.")
    @PositiveOrZero(message = "The price cannot be negative.")
    BigDecimal basePrice;

    @NotEmpty(message = "At least one amenity must be selected.")
    List<String> amenities;

}
