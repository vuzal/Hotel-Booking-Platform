package com.vusal.azerbook.service.impl;

import com.vusal.azerbook.exception.*;
import com.vusal.azerbook.model.request.ReservationCreateRequest;
import com.vusal.azerbook.model.response.ReservationResponse;
import com.vusal.azerbook.model.entity.Hotel;
import com.vusal.azerbook.model.entity.Reservation;
import com.vusal.azerbook.model.entity.Room;
import com.vusal.azerbook.model.entity.User;
import com.vusal.azerbook.enums.ReservationStatus;
import com.vusal.azerbook.mapper.EntityMapper;
import com.vusal.azerbook.repository.HotelRepository;
import com.vusal.azerbook.repository.ReservationRepository;
import com.vusal.azerbook.repository.RoomRepository;
import com.vusal.azerbook.repository.UserRepository;
import com.vusal.azerbook.service.ReservationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReservationServiceImpl implements ReservationService {

    private final ReservationRepository reservationRepository;
    private final UserRepository userRepository;
    private final RoomRepository roomRepository;
    private final HotelRepository hotelRepository;
    private final EntityMapper mapper;


    @Override
    public ReservationResponse create(ReservationCreateRequest request, Long userId) {

        if (!request.getCheckOut().isAfter(request.getCheckIn())) {
            throw new BadRequestException("THE CHECK-OUT DATE MUST BE AFTER THE CHECK-IN DATE!");
        }

        User user = userRepository.findById(userId).orElseThrow(() -> new NotFoundException("USER NOT FOUND. userId: " + userId));
        Room room = roomRepository.findById(request.getRoomId()).orElseThrow(() -> new RuntimeException("ROOM NOT FOUND. roomId: " + request.getRoomId()));
        Hotel hotel = hotelRepository.findById(request.getHotelId()).orElseThrow(() -> new RuntimeException("HOTEL NOT FOUND. hotelId: " + request.getHotelId()));

        if (!isRoomAvailable(request.getRoomId(), request.getCheckIn(), request.getCheckOut())) {
            throw new RoomNotAvailableException("ROOM IS NOT AVAILABLE FOR SELECTED DATE!");
        }

        if (request.getGuestCount() > room.getCapacity()) {
            throw new BadRequestException("THE NUMBER OF GUEST COUNT EXCEEDS THE ROOM CAPACITY. MAXIMUM CAPACITY: " + room.getCapacity());
        }

        long nights = ChronoUnit.DAYS.between(request.getCheckIn(), request.getCheckOut());
        BigDecimal totalPrice = room.getPrice().multiply(BigDecimal.valueOf(nights));
        Reservation reservation = Reservation.builder()
                .user(user)
                .room(room)
                .hotel(hotel)
                .checkIn(request.getCheckIn())
                .checkOut(request.getCheckOut())
                .totalPrice(totalPrice)
                .status(ReservationStatus.PENDING)
                .guestCount(request.getGuestCount())
                .build();
        Reservation saved = reservationRepository.save(reservation);
        return mapper.toReservationResponse(saved);
    }

    @Override
    public List<ReservationResponse> getAll() {
        return reservationRepository.findAll()
                .stream().map(mapper::toReservationResponse).toList();
    }


    @Override
    public List<ReservationResponse> getByUserId(Long userId) {
        return reservationRepository.findByUserId(userId).stream()
                .map(mapper::toReservationResponse).toList();
    }

    @Override
    public ReservationResponse getById(Long id) {
        Reservation reservation = reservationRepository.findById(id).orElseThrow(() -> new NotFoundException("RESERVATION NOT FOUND. id: " + id));
        return mapper.toReservationResponse(reservation);
    }

    @Override
    public ReservationResponse cancel(Long id, Long currentUserId) {
        Reservation reservation = reservationRepository.findById(id).orElseThrow(() -> new NotFoundException("RESERVATION NOT FOUND. id: " + id));

        if (!reservation.getUser().getId().equals(currentUserId)) {
            throw new ForbiddenException("YOU ARE NOT AUTHORIZED TO CANCEL THIS RESERVATION!");
        }

        if (reservation.getStatus() == ReservationStatus.CANCELLED) {
            throw new AlreadyExistsException("RESERVATION ALREADY CANCELLED!");
        }

        reservation.setStatus(ReservationStatus.CANCELLED);
        Reservation saved = reservationRepository.save(reservation);
        return mapper.toReservationResponse(saved);
    }

    @Override
    public ReservationResponse complete(Long id) {
        Reservation reservation = reservationRepository.findById(id).orElseThrow(() -> new NotFoundException("RESERVATION NOT FOUND. id: " + id));
        reservation.setStatus(ReservationStatus.COMPLETED);
        Reservation saved = reservationRepository.save(reservation);
        return mapper.toReservationResponse(saved);

    }

    @Override
    public Boolean isRoomAvailable(Long roomId, LocalDate checkIn, LocalDate checkOut) {
        List<Reservation> conflictingReservations = reservationRepository.findConflictingReservations(roomId, checkIn, checkOut, ReservationStatus.CANCELLED);
        return conflictingReservations.isEmpty();
    }
}
