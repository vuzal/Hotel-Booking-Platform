package com.vusal.azerbook.service;

import com.vusal.azerbook.dto.response.UserResponse;

public interface UserService {

    UserResponse getById(Long id);

    UserResponse getByEmail(String email);

    UserResponse updateProfile(Long userId, String firstName, String lastName, String phone);


}
