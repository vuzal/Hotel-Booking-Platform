package com.vusal.azerbook.model.response;

import lombok.Data;

@Data
public class AuthResponse {

    private TokenResponse tokens;
    private UserResponse user;

}
