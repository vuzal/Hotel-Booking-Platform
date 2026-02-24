package com.vusal.azerbook.dto.response;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ReviewResponse {

    Long id;
    String userName;
    Double rating;
    String comment;
    LocalDateTime createdAt;
}
