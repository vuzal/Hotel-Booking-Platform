package com.vusal.azerbook.service;

import com.vusal.azerbook.model.response.UserResponse;

import java.util.List;

public interface UserService {

    UserResponse getById(Long id);

    List<UserResponse> getAll();

    UserResponse getByEmail(String email);

    UserResponse updateProfile(Long userId, String firstName, String lastName, String phone);


}
