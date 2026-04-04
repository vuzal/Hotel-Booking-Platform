package com.vusal.azerbook.service.impl;

import com.vusal.azerbook.exception.NotFoundException;
import com.vusal.azerbook.model.dto.UserUpdateRequest;
import com.vusal.azerbook.model.response.UserResponse;
import com.vusal.azerbook.model.entity.User;
import com.vusal.azerbook.mapper.EntityMapper;
import com.vusal.azerbook.repository.UserRepository;
import com.vusal.azerbook.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final EntityMapper mapper;

    @Override
    public UserResponse getById(Long id) {
        User user = userRepository.findById(id).orElseThrow(() -> new NotFoundException("USER NOT FOUND. id: " + id));
        return mapper.toUserResponse(user);
    }

    @Override
    public List<UserResponse> getAll() {
        return userRepository.findAll().stream()
                .map(mapper::toUserResponse).toList();
    }

    @Override
    public UserResponse getByEmail(String email) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new NotFoundException("USER NOT FOUND. email: " + email));
        return mapper.toUserResponse(user);
    }

    @Override
    public UserResponse updateProfile(Long userId, UserUpdateRequest userUpdateRequest) {
        User user = userRepository.findById(userId).orElseThrow(() -> new NotFoundException("USER NOT FOUND. id: " + userId));

        user.setFirstName(userUpdateRequest.getFirstName());
        user.setLastName(userUpdateRequest.getLastName());
        user.setPhone(userUpdateRequest.getPhone());

        User updatedUser = userRepository.save(user);
        return mapper.toUserResponse(updatedUser);
    }
}
