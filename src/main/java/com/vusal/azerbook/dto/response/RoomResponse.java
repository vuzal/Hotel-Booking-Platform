package com.vusal.azerbook.dto.response;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class RoomResponse {

    Long id;
    String name;
    BigDecimal price;
    String type;
    Integer capacity;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;


}
