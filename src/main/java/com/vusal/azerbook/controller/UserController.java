package com.vusal.azerbook.controller;

import com.vusal.azerbook.model.dto.UserUpdateRequest;
import com.vusal.azerbook.model.response.UserResponse;
import com.vusal.azerbook.security.CurrentUser;
import com.vusal.azerbook.security.UserDetailsImpl;
import com.vusal.azerbook.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getMyProfile(@CurrentUser UserDetailsImpl currentUser) {

        return ResponseEntity.ok(userService.getById(currentUser.getId()));

    }

    @GetMapping("/email/{email}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponse> getUserByEmail(@PathVariable String email) {
        return ResponseEntity.ok(userService.getByEmail(email));
    }

    @PutMapping("/profile")
    public ResponseEntity<UserResponse> updateProfile(
            @CurrentUser UserDetailsImpl currentUser, @Valid @RequestBody UserUpdateRequest request) {
        return ResponseEntity.ok(
                userService.updateProfile(
                        currentUser.getId(), request.getFirstName(), request.getLastName(), request.getPhone())

        );
    }

}
