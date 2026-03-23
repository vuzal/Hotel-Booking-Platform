package com.vusal.azerbook.controller;

import com.vusal.azerbook.model.request.ReservationCreateRequest;
import com.vusal.azerbook.model.response.ReservationResponse;
import com.vusal.azerbook.security.CurrentUser;
import com.vusal.azerbook.security.UserDetailsImpl;
import com.vusal.azerbook.service.ReservationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/reservations")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class ReservationController {

    private final ReservationService reservationService;

    @PostMapping
    public ResponseEntity<ReservationResponse> create(@Valid @RequestBody ReservationCreateRequest request,
                                                      @CurrentUser UserDetailsImpl currentUser) {
        return ResponseEntity.status(HttpStatus.CREATED).body(reservationService.create(request, currentUser.getId()));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<List<ReservationResponse>>getAll(){
        return ResponseEntity.status(HttpStatus.OK).body(reservationService.getAll());
    }

    @GetMapping("/my")
    public ResponseEntity<List<ReservationResponse>> getMyReservations(@CurrentUser UserDetailsImpl currentUser) {
        return ResponseEntity.ok(reservationService.getByUserId(currentUser.getId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReservationResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(reservationService.getById(id));
    }

    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @PatchMapping("/{id}/cancel")
    public ResponseEntity<ReservationResponse> cancel(@PathVariable Long id,@CurrentUser UserDetailsImpl currentUser) {
        return ResponseEntity.ok(reservationService.cancel(id,currentUser.getId()));
    }

    @PatchMapping("/{id}/complete")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ReservationResponse> complete(@PathVariable Long id) {
        return ResponseEntity.ok(reservationService.complete(id));
    }

    @GetMapping("/availability")
    public ResponseEntity<Boolean> checkAvailability(
            @RequestParam Long roomId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkIn,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkOut) {
        return ResponseEntity.ok(reservationService.isRoomAvailable(roomId, checkIn, checkOut));
    }
}
