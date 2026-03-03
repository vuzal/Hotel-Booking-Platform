package com.vusal.azerbook.dto.response;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class UserResponse {

    Long id;
    String email;
    String firstName;
    String lastName;
    String phone;
    String role;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;

}
