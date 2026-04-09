package com.vusal.azerbook.service.impl;

import com.vusal.azerbook.exception.NotFoundException;
import com.vusal.azerbook.model.request.HotelCreateRequest;
import com.vusal.azerbook.model.entity.Hotel;
import com.vusal.azerbook.mapper.EntityMapper;
import com.vusal.azerbook.repository.HotelRepository;
import com.vusal.azerbook.service.HotelService;
import lombok.RequiredArgsConstructor;
import com.vusal.azerbook.model.response.HotelDetailResponse;
import com.vusal.azerbook.model.response.HotelResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;


@Service
@RequiredArgsConstructor
public class HotelServiceImpl implements HotelService {

    private final HotelRepository hotelRepository;
    private final EntityMapper mapper;

    @Override
    public HotelResponse create(HotelCreateRequest request) {
        Hotel hotel = mapper.toHotelEntity(request);

        Hotel saved = hotelRepository.save(hotel);
        return mapper.toHotelResponse(saved);
    }

    @Override
    public Page<HotelResponse> getAll(int page, int size) {
        Pageable pageable= PageRequest.of(page,size);
        Page<Hotel> hotelPage= hotelRepository.findAll(pageable);
        return hotelPage
                .map(mapper::toHotelResponse);
    }

    @Override
    public HotelDetailResponse getById(Long id) {
        Hotel hotel = hotelRepository.findById(id).orElseThrow(() -> new NotFoundException("HOTEL NOT FOUND. ID: " + id));
        return mapper.toHotelDetailResponse(hotel);
    }

    @Override
    public Page<HotelResponse> getByCity(String city, int page, int size) {
        Pageable pageable= PageRequest.of(page,size);
        Page<Hotel> hotels = hotelRepository.findByCityContainingIgnoreCase(city,pageable);

        if (hotels.isEmpty()) {
            throw new NotFoundException("HOTEL NOT FOUND. CITY: " + city);
        }
        return hotels
                .map(mapper::toHotelResponse);
    }

    public Map<String,Long>getCityHotelCounts(){
        List<String>cities=List.of("Bakı", "Şəki", "Qəbələ", "Quba", "Şahdağ", "Naftalan");
        Map<String,Long> counts = new HashMap<>();
        for ( String city:cities){
            counts.put(city,hotelRepository.countByCity(city));
        }
        return counts;
    }

    @Override
    public Page<HotelResponse> searchByName(String name, int page, int size) {
        Pageable pageable= PageRequest.of(page,size);
        Page<Hotel> hotels = hotelRepository.findByNameIgnoreCase(name,pageable);

        if (hotels.isEmpty()) {
            throw new NotFoundException("HOTEL NOT FOUND. NAME: " + name);
        }
        return hotels.map(mapper::toHotelResponse);
    }

    @Override
    public HotelResponse update(Long id, HotelCreateRequest request) {
        Hotel hotel = hotelRepository.findById(id).orElseThrow(() -> new NotFoundException("HOTEL NOT FOUND. ID: " + id));
        hotel.setName(request.getName());
        hotel.setDescription(request.getDescription());
        hotel.setCity(request.getCity());
        hotel.setAddress(request.getAddress());
        hotel.setMainImageUrl(request.getMainImageUrl());
        hotel.setAmenities(request.getAmenities());
        hotel.setRating(request.getRating());


        Hotel updated = hotelRepository.save(hotel);
        return mapper.toHotelResponse(updated);
    }

    @Override
    public void delete(Long id) {
        Hotel hotel = hotelRepository.findById(id).orElseThrow(() -> new NotFoundException("HOTEL NOT FOUND. ID: " + id));
        hotel.setIsActive(false);
        hotelRepository.save(hotel);

    }
}
