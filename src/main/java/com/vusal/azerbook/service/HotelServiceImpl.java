package com.vusal.azerbook.service;

import com.vusal.azerbook.dto.request.HotelCreateRequest;
import com.vusal.azerbook.dto.response.*;
import com.vusal.azerbook.entity.Hotel;
import com.vusal.azerbook.mapper.EntityMapper;
import com.vusal.azerbook.repository.HotelRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
@RequiredArgsConstructor
public class HotelServiceImpl implements HotelService {

    private final HotelRepository hotelRepository;
    private final EntityMapper mapper;

    @Override
    public HotelResponse create(HotelCreateRequest request) {
        Hotel hotel = Hotel.builder()
                .name(request.getName())
                .description(request.getDescription())
                .city(request.getCity())
                .address(request.getAddress())
                .rating(0.0)
                .build();
        Hotel saved = hotelRepository.save(hotel);
        return mapper.toHotelResponse(saved);
    }

    @Override
    public List<HotelResponse> getAll() {
        return hotelRepository.findAll().stream()
                .map(mapper::toHotelResponse)
                .toList();
    }

    @Override
    public HotelDetailResponse getById(Long id) {
        Hotel hotel = hotelRepository.findById(id).orElseThrow(() -> new RuntimeException("Hotel Not Found"));
        return mapper.toHotelDetailResponse(hotel);
    }

    @Override
    public List<HotelResponse> getByCity(String city) {
        return hotelRepository.findByCityIgnoreCase(city).stream()
                .map(mapper::toHotelResponse).toList();
    }

    @Override
    public List<HotelResponse> searchByName(String name) {
        return hotelRepository.findByNameIgnoreCase(name).stream()
                .map(mapper::toHotelResponse).toList();
    }

    @Override
    public HotelResponse update(Long id, HotelCreateRequest request) {
        Hotel hotel = hotelRepository.findById(id).orElseThrow(() -> new RuntimeException("Hotel Not Found"));
        hotel.setName(request.getName());
        hotel.setDescription(request.getDescription());
        hotel.setCity(request.getCity());
        hotel.setAddress(request.getAddress());

        Hotel updated = hotelRepository.save(hotel);
        return mapper.toHotelResponse(updated);
    }

    @Override
    public void delete(Long id) {
        Hotel hotel = hotelRepository.findById(id).orElseThrow(() -> new RuntimeException("Hotel Not Found"));
        hotel.setIsActive(false);
        hotelRepository.save(hotel);

    }
}
