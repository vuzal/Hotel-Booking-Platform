package com.vusal.azerbook.service;

import com.vusal.azerbook.dto.request.RoomCreateRequest;
import com.vusal.azerbook.dto.response.RoomResponse;
import com.vusal.azerbook.entity.Hotel;
import com.vusal.azerbook.entity.Room;
import com.vusal.azerbook.mapper.EntityMapper;
import com.vusal.azerbook.repository.HotelRepository;
import com.vusal.azerbook.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RoomServiceImpl implements RoomService {

    private final RoomRepository roomRepository;
    private final HotelRepository hotelRepository;
    private final EntityMapper mapper;

    @Override
    public RoomResponse create(RoomCreateRequest request) {
        Hotel hotel = hotelRepository.findById(request.getHotelId()).orElseThrow(() -> new IllegalArgumentException("Hotel id not found"));
        Room room = Room.builder()
                .hotel(hotel)
                .name(request.getName())
                .type(request.getType())
                .price(request.getPrice())
                .capacity(request.getCapacity())
                .build();
        Room roomCreated = roomRepository.save(room);
        return mapper.toRoomResponse(roomCreated);
    }

    @Override
    public RoomResponse getById(Long id) {
        Room room = roomRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Room id not found"));
        return mapper.toRoomResponse(room);
    }

    @Override
    public List<RoomResponse> getByHotelId(Long hotelId) {
        return roomRepository.findByHotelId(hotelId).stream()
                .map(mapper::toRoomResponse).toList();
    }

    @Override
    public RoomResponse update(Long id, RoomCreateRequest request) {
        Room room = roomRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Room id not found"));
        room.setName(request.getName());
        room.setType(request.getType());
        room.setPrice(request.getPrice());
        room.setCapacity(request.getCapacity());
        Room updated = roomRepository.save(room);
        return mapper.toRoomResponse(updated);

    }

    @Override
    public void delete(Long id) {
        Room room = roomRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Room id not found"));
        room.setIsActive(false);
        roomRepository.save(room);
    }
}
