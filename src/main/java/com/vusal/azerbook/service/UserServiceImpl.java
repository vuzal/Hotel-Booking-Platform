package com.vusal.azerbook.service;

import com.vusal.azerbook.dto.response.UserResponse;
import com.vusal.azerbook.entity.User;
import com.vusal.azerbook.mapper.EntityMapper;
import com.vusal.azerbook.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final EntityMapper mapper;

    @Override
    public UserResponse getById(Long id) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        return mapper.toUserResponse(user);
    }

    @Override
    public UserResponse getByEmail(String email) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        return mapper.toUserResponse(user);
    }

    @Override
    public UserResponse updateProfile(Long userId, String firstName, String lastName, String phone) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setPhone(phone);

        User updatedUser = userRepository.save(user);
        return mapper.toUserResponse(updatedUser);
    }
}
