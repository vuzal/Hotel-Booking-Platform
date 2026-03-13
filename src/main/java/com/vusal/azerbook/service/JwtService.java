package com.vusal.azerbook.service;

import com.vusal.azerbook.model.response.TokenResponse;

public interface JwtService {

    TokenResponse generateTokens(String email);

    String extractEmailFromAccessToken(String token);

    String extractEmailFromRefreshToken(String token);

    Boolean validateAccessToken(String token);

    Boolean validateRefreshToken(String token);

    TokenResponse refreshAccessToken(String refreshToken);

}
