package com.vusal.azerbook.service;

import com.vusal.azerbook.model.entity.User;
import com.vusal.azerbook.model.response.FavoriteResponse;

import java.util.List;

public interface FavoriteService {

    void toggleFavorite(Long userId, Long hotelId);
    List<FavoriteResponse>getMyFavorites(Long userId);

}
