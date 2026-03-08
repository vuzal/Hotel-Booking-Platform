package com.vusal.azerbook.dto.response;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class ImageResponse {

    Long id;
    String url;
    Boolean isMain;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;

}
