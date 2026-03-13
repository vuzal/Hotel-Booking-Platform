package com.vusal.azerbook.service.impl;

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
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        Room room = roomRepository.findById(request.getRoomId()).orElseThrow(() -> new RuntimeException("Room not found"));
        Hotel hotel = hotelRepository.findById(request.getHotelId()).orElseThrow(() -> new RuntimeException("Hotel not found"));

        if (!isRoomAvailable(request.getRoomId(), request.getCheckIn(), request.getCheckOut())) {
            throw new RuntimeException("Room is not available for selected dates");
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
    public List<ReservationResponse> getByUserId(Long userId) {
        return reservationRepository.findByUserId(userId).stream()
                .map(mapper::toReservationResponse).toList();
    }

    @Override
    public ReservationResponse getById(Long id) {
        Reservation reservation = reservationRepository.findById(id).orElseThrow(() -> new RuntimeException("Reservation not found"));
        return mapper.toReservationResponse(reservation);
    }

    @Override
    public void cancel(Long id) {
        Reservation reservation = reservationRepository.findById(id).orElseThrow(() -> new RuntimeException("Reservation not found"));
        reservation.setStatus(ReservationStatus.CANCELLED);
        reservationRepository.save(reservation);

    }

    @Override
    public void complete(Long id) {
        Reservation reservation = reservationRepository.findById(id).orElseThrow(() -> new RuntimeException("Reservation not found"));
        reservation.setStatus(ReservationStatus.COMPLETED);
        reservationRepository.save(reservation);

    }

    @Override
    public Boolean isRoomAvailable(Long roomId, LocalDate checkIn, LocalDate checkOut) {
        List<Reservation> conflictingReservations = reservationRepository.findConflictingReservations(roomId, checkIn, checkOut, ReservationStatus.CANCELLED);
        return conflictingReservations.isEmpty();
    }
}
