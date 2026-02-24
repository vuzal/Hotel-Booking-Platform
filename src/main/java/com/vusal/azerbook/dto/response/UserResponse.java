package com.vusal.azerbook.dto.response;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserResponse {

    Long id;
    String email;
    String firstName;
    String lastName;
    String phone;
    String role;
    LocalDateTime createdAt;

}
