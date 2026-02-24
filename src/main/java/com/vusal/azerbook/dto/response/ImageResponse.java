package com.vusal.azerbook.dto.response;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ImageResponse {

    Long id;
    String url;
    String isMain;

}
