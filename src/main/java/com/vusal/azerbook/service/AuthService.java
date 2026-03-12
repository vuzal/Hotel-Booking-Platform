package com.vusal.azerbook.service;

import com.vusal.azerbook.dto.request.UserLoginRequest;
import com.vusal.azerbook.dto.request.UserRegisterRequest;
import com.vusal.azerbook.dto.response.AuthResponse;

public interface AuthService {

    AuthResponse register(UserRegisterRequest request);

    AuthResponse login(UserLoginRequest request);
}
