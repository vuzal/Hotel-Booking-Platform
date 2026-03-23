package com.vusal.azerbook.service.impl;

import com.vusal.azerbook.exception.NotFoundException;
import com.vusal.azerbook.model.request.RoomCreateRequest;
import com.vusal.azerbook.model.response.RoomResponse;
import com.vusal.azerbook.model.entity.Hotel;
import com.vusal.azerbook.model.entity.Room;
import com.vusal.azerbook.mapper.EntityMapper;
import com.vusal.azerbook.repository.HotelRepository;
import com.vusal.azerbook.repository.RoomRepository;
import com.vusal.azerbook.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RoomServiceImpl implements RoomService {

    private final RoomRepository roomRepository;
    private final HotelRepository hotelRepository;
    private final EntityMapper mapper;

    @Override
    public RoomResponse create(RoomCreateRequest request) {
        Hotel hotel = hotelRepository.findById(request.getHotelId()).orElseThrow(() -> new NotFoundException("HOTEL NOT FOUND. hotelId: " + request.getHotelId()));
        Room room = Room.builder()
                .hotel(hotel)
                .name(request.getName())
                .type(request.getType())
                .price(request.getPrice())
                .capacity(request.getCapacity())
                .build();
        Room roomCreated = roomRepository.save(room);
        updateHotelBasePrice(request.getHotelId());
        return mapper.toRoomResponse(roomCreated);
    }

    @Override
    public RoomResponse getById(Long id) {
        Room room = roomRepository.findById(id).orElseThrow(() -> new NotFoundException("ROOM NOT FOUND. id: " + id));
        return mapper.toRoomResponse(room);
    }

    @Override
    public List<RoomResponse> getAll() {
        return roomRepository.findAll().stream()
                .map(mapper::toRoomResponse).toList();
    }

    @Override
    public List<RoomResponse> getByHotelId(Long hotelId) {
        return roomRepository.findByHotelId(hotelId).stream()
                .map(mapper::toRoomResponse).toList();
    }

    @Override
    public RoomResponse update(Long id, RoomCreateRequest request) {
        Room room = roomRepository.findById(id).orElseThrow(() -> new NotFoundException("ROOM NOT FOUND. id: " + id));
        room.setName(request.getName());
        room.setType(request.getType());
        room.setPrice(request.getPrice());
        room.setCapacity(request.getCapacity());
        Room updated = roomRepository.save(room);
        updateHotelBasePrice(request.getHotelId());
        return mapper.toRoomResponse(updated);

    }

    @Override
    public void updateHotelBasePrice(Long hotelId) {
        BigDecimal minPrice = roomRepository.findMinPriceByHotelId(hotelId);

        Hotel hotel = hotelRepository.findById(hotelId).orElseThrow(() -> new NotFoundException("HOTEL NOT FOUND. id: " + hotelId));
        hotel.setBasePrice(minPrice != null ? minPrice : BigDecimal.valueOf(0.0));
        hotelRepository.save(hotel);

    }

    @Override
    public void delete(Long id) {
        Room room = roomRepository.findById(id).orElseThrow(() -> new NotFoundException("ROOM NOT FOUND. id: " + id));
        room.setIsActive(false);
        roomRepository.save(room);
        updateHotelBasePrice(room.getHotel().getId());

    }
}
