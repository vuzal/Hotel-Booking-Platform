package com.vusal.azerbook.controller;

import com.vusal.azerbook.model.dto.PaymentProcess;
import com.vusal.azerbook.model.request.PaymentCreateRequest;
import com.vusal.azerbook.model.response.PaymentResponse;
import com.vusal.azerbook.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;


    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PaymentResponse> create(@Valid @RequestBody PaymentCreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(paymentService.create(request));
    }

    @PostMapping("/{reservationId}/process")
    public ResponseEntity<PaymentResponse> processPayment(@PathVariable Long reservationId,
                                                          @RequestBody PaymentProcess paymentProcess) {
        return ResponseEntity.ok(paymentService.processPayment(reservationId, paymentProcess.method()));
    }

    @GetMapping("/reservation/{reservationId}")
    public ResponseEntity<List<PaymentResponse>> getByReservationId(@PathVariable Long reservationId) {
        return  ResponseEntity.ok(paymentService.getByReservationId(reservationId));
    }


    @GetMapping("/{id}")
    public ResponseEntity<PaymentResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(paymentService.getById(id));
    }
}
