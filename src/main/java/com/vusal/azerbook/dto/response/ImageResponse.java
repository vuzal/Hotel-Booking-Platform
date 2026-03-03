package com.vusal.azerbook.dto.response;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class ImageResponse {

    Long id;
    String url;
    Boolean isMain;

}
