package com.vusal.azerbook.model.response;

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
    String publicId;
    Boolean isMain;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;

}
