package com.vusal.azerbook.service;

import com.vusal.azerbook.model.request.UserLoginRequest;
import com.vusal.azerbook.model.request.UserRegisterRequest;
import com.vusal.azerbook.model.response.AuthResponse;

public interface AuthService {

    AuthResponse register(UserRegisterRequest request);

    AuthResponse login(UserLoginRequest request);
}
