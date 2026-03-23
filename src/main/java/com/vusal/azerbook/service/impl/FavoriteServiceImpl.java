package com.vusal.azerbook.service.impl;

import com.vusal.azerbook.exception.NotFoundException;
import com.vusal.azerbook.mapper.EntityMapper;
import com.vusal.azerbook.model.entity.Favorite;
import com.vusal.azerbook.model.entity.Hotel;
import com.vusal.azerbook.model.entity.User;
import com.vusal.azerbook.model.response.FavoriteResponse;
import com.vusal.azerbook.repository.FavoriteRepository;
import com.vusal.azerbook.repository.HotelRepository;
import com.vusal.azerbook.repository.UserRepository;
import com.vusal.azerbook.service.FavoriteService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class FavoriteServiceImpl implements FavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final UserRepository userRepository;
    private final HotelRepository hotelRepository;
    private final EntityMapper mapper;

    @Override
    @Transactional
    public void toggleFavorite(Long userId, Long hotelId) {
        User user = userRepository.findById(userId).orElseThrow(()->new NotFoundException("USER NOT FOUND. userID = " + userId));
        Optional<Favorite> existing = favoriteRepository.findByUserIdAndHotelId(userId, hotelId);
        if (existing.isPresent()) {
            favoriteRepository.delete(existing.get());
        } else {
            Hotel hotel = hotelRepository.findById(hotelId).orElseThrow(()->new NotFoundException("HOTEL NOT FOUND. hotelID = " + hotelId));

            Favorite favorite = Favorite.builder()
                    .user(user)
                    .hotel(hotel)
                    .build();
            favoriteRepository.save(favorite);
        }
    }

    @Override
    public List<FavoriteResponse> getMyFavorites(Long userId) {
        return favoriteRepository.findByUserId(userId).stream()
                .map(mapper::toFavoriteResponse).toList();
    }
}
