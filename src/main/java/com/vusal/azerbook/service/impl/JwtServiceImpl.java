package com.vusal.azerbook.service.impl;

import com.vusal.azerbook.exception.InvalidTokenException;
import com.vusal.azerbook.model.response.TokenResponse;
import com.vusal.azerbook.service.JwtService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.time.Instant;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtServiceImpl implements JwtService {

    @Value("${jwt.access-secret}")
    private String accessSecret;
    @Value("${jwt.refresh-secret}")
    private String refreshSecret;
    @Value("${jwt.access-expiration}")
    private Long accessExpiration;
    @Value("${jwt.refresh-expiration}")
    private Long refreshExpiration;

    private SecretKey getAccessSignKey() {
        byte[] keyBytes = Decoders.BASE64.decode(accessSecret);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    private SecretKey getRefreshSignKey() {
        byte[] keyBytes = Decoders.BASE64.decode(refreshSecret);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    private String generateAccessToken(String email) {

        Map<String, Object> extraClaims = new HashMap<>();
        extraClaims.put("type", "ACCESS");

        Instant now = Instant.now();

        return Jwts.builder()
                .claims(extraClaims)
                .subject(email)
                .issuedAt(Date.from(now))
                .expiration(Date.from(now.plusMillis(accessExpiration)))
                .signWith(getAccessSignKey())
                .compact();
    }

    private String generateRefreshToken(String email) {
        Map<String, Object> extraClaims = new HashMap<>();
        extraClaims.put("type", "REFRESH");

        Instant now = Instant.now();

        return Jwts.builder()
                .claims(extraClaims)
                .subject(email)
                .issuedAt(Date.from(now))
                .expiration(Date.from(now.plusMillis(refreshExpiration)))
                .signWith(getRefreshSignKey())
                .compact();
    }

    private <T> T extractClaim(String token, SecretKey key, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token, key);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token, SecretKey key) {
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    private Boolean isTokenExpired(Claims claims) {
        return claims.getExpiration().before(Date.from(Instant.now()));
    }


    @Override
    public TokenResponse generateTokens(String email) {
        return TokenResponse.builder()
                .accessToken(generateAccessToken(email))
                .refreshToken(generateRefreshToken(email))
                .accessTokenExpiresIn(accessExpiration)
                .refreshTokenExpiresIn(refreshExpiration)
                .build();
    }

    @Override
    public String extractEmailFromAccessToken(String token) {
        return extractClaim(token, getAccessSignKey(), Claims::getSubject);
    }

    @Override
    public String extractEmailFromRefreshToken(String token) {
        return extractClaim(token, getRefreshSignKey(), Claims::getSubject);
    }

    @Override
    public Boolean validateAccessToken(String token) {
        try {
            Claims claims = extractAllClaims(token, getAccessSignKey());
            return !isTokenExpired(claims) && "ACCESS".equals(claims.get("type"));
        } catch (Exception e) {
            return false;
        }
    }

    public Boolean validateRefreshToken(String token) {
        try {
            Claims claims = extractAllClaims(token, getRefreshSignKey());
            return !isTokenExpired(claims) && "REFRESH".equals(claims.get("type"));
        } catch (Exception e) {
            return false;
        }
    }

    @Override
    public TokenResponse refreshAccessToken(String refreshToken) {
        if (!validateRefreshToken(refreshToken)) {
            throw new InvalidTokenException("REFRESH TOKEN IS INVALID OR EXPIRED");
        }
        String email = extractEmailFromRefreshToken(refreshToken);
        return generateTokens(email);
    }
}
