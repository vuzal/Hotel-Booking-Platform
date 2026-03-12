package com.vusal.azerbook.dto.response;

import lombok.Data;

@Data
public class AuthResponse {

    private TokenResponse tokens;
    private UserResponse user;

}
