package com.vusal.azerbook.controller;

import com.vusal.azerbook.model.request.HotelCreateRequest;
import com.vusal.azerbook.model.response.HotelDetailResponse;
import com.vusal.azerbook.model.response.HotelResponse;
import com.vusal.azerbook.service.HotelService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hotels")
@RequiredArgsConstructor
public class HotelController {

    private final HotelService hotelService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<HotelResponse> createHotel(@Valid @RequestBody HotelCreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(hotelService.create(request));
    }

    @GetMapping
    public ResponseEntity<List<HotelResponse>> getAll() {
        return ResponseEntity.status(HttpStatus.OK).body(hotelService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<HotelDetailResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(hotelService.getById(id));
    }

    @GetMapping("/city/{city}")
    public ResponseEntity<List<HotelResponse>> getByCity(@PathVariable String city) {
        return ResponseEntity.status(HttpStatus.OK).body(hotelService.getByCity(city));
    }

    @GetMapping("/search")
    public ResponseEntity<List<HotelResponse>> searchByName(@RequestParam String name) {
        return ResponseEntity.ok(hotelService.searchByName(name));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<HotelResponse> update(@PathVariable Long id, @Valid @RequestBody HotelCreateRequest request) {
        return ResponseEntity.status(HttpStatus.OK).body(hotelService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    ResponseEntity<Void> delete(@PathVariable Long id) {
        hotelService.delete(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}
