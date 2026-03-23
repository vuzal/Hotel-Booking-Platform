package com.vusal.azerbook.controller;

import com.vusal.azerbook.model.response.FavoriteResponse;
import com.vusal.azerbook.security.CurrentUser;
import com.vusal.azerbook.security.UserDetailsImpl;
import com.vusal.azerbook.service.FavoriteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/favorites")
@RequiredArgsConstructor
public class FavoriteController {
    private final FavoriteService favoriteService;

    @PostMapping("/{hotelId}")
    public ResponseEntity<Void>toggle(@PathVariable Long hotelId, @CurrentUser UserDetailsImpl user) {
        favoriteService.toggleFavorite( user.getId(),hotelId);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<List<FavoriteResponse>> getMyFavorites(@CurrentUser UserDetailsImpl user) {
        return  ResponseEntity.ok(favoriteService.getMyFavorites(user.getId()));
    }

}
