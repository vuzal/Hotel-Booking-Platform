package com.vusal.azerbook.service.impl;

import com.vusal.azerbook.exception.AlreadyExistsException;
import com.vusal.azerbook.exception.InvalidCredentialsException;
import com.vusal.azerbook.exception.NotFoundException;
import com.vusal.azerbook.model.request.UserLoginRequest;
import com.vusal.azerbook.model.request.UserRegisterRequest;
import com.vusal.azerbook.model.response.AuthResponse;
import com.vusal.azerbook.model.entity.User;
import com.vusal.azerbook.mapper.EntityMapper;
import com.vusal.azerbook.repository.UserRepository;
import com.vusal.azerbook.service.AuthService;
import com.vusal.azerbook.service.JwtService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final EntityMapper mapper;

    @Transactional
    @Override
    public AuthResponse register(UserRegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new AlreadyExistsException("EMAIL ALREADY EXISTS: "+request.getEmail());
        }

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .phone(request.getPhone())
                .role("USER")
                .build();

        User saved = userRepository.save(user);
        AuthResponse authResponse = new AuthResponse();
        authResponse.setTokens(jwtService.generateTokens(saved.getEmail()));
        authResponse.setUser(mapper.toUserResponse(saved));
        return authResponse;
    }

    @Override
    public AuthResponse login(UserLoginRequest request) {
        User user=userRepository.findByEmail(request.getEmail())
                .orElseThrow(()->new NotFoundException("EMAIL NOT FOUND: "+request.getEmail()));

        if (!passwordEncoder.matches(request.getPassword(),user.getPassword())) {
            throw new InvalidCredentialsException("WRONG PASSWORD");
        }

        AuthResponse authResponse = new AuthResponse();
        authResponse.setTokens(jwtService.generateTokens(user.getEmail()));
        authResponse.setUser(mapper.toUserResponse(user));
        return authResponse;
    }
}
