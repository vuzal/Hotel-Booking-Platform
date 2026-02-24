package com.vusal.azerbook.dto.response;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RoomResponse {

    Long id;
    String name;
    BigDecimal price;
    Integer capacity;

}
