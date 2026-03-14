package com.vusal.azerbook.service.impl;

import com.vusal.azerbook.model.request.PaymentCreateRequest;
import com.vusal.azerbook.model.response.PaymentResponse;
import com.vusal.azerbook.model.entity.Payment;
import com.vusal.azerbook.model.entity.Reservation;
import com.vusal.azerbook.enums.PaymentMethod;
import com.vusal.azerbook.enums.PaymentStatus;
import com.vusal.azerbook.enums.ReservationStatus;
import com.vusal.azerbook.mapper.EntityMapper;
import com.vusal.azerbook.repository.PaymentRepository;
import com.vusal.azerbook.repository.ReservationRepository;
import com.vusal.azerbook.service.PaymentService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final ReservationRepository reservationRepository;
    private final PaymentRepository paymentRepository;
    private final EntityMapper mapper;

    private PaymentStatus simulatePaymentProcessing() {
        return Math.random() > 0.1 ? PaymentStatus.PAID : PaymentStatus.FAILED;
    }

    @Override
    public PaymentResponse create(PaymentCreateRequest request) {
        Reservation reservation = reservationRepository.findById(request.getReservationId()).orElseThrow(() -> new RuntimeException("Reservation not found"));
        Payment payment = Payment.builder()
                .reservation(reservation)
                .amount(request.getAmount())
                .method(request.getMethod())
                .status(PaymentStatus.PENDING)
                .build();
        Payment saved = paymentRepository.save(payment);
        return mapper.toPaymentResponse(saved);

    }

    @Override
    @Transactional
    public PaymentResponse processPayment(Long reservationId, PaymentMethod method) {
        Reservation reservation = reservationRepository.findById(reservationId).orElseThrow(() -> new RuntimeException("Reservation not found"));

        List<Payment> existingPayments = paymentRepository.findByReservationId(reservationId);
        if (!existingPayments.isEmpty()) {
            throw new RuntimeException("Payment already exists");
        }
        Payment payment = Payment.builder()
                .reservation(reservation)
                .amount(reservation.getTotalPrice())
                .method(method)
                .build();
        PaymentStatus status = simulatePaymentProcessing();
        payment.setStatus(status);

        if (status == PaymentStatus.PAID) {
            reservation.setStatus(ReservationStatus.CONFIRMED);
        } else if (status == PaymentStatus.FAILED) {
            reservation.setStatus(ReservationStatus.CANCELLED);
        }
        reservationRepository.save(reservation);
        Payment saved = paymentRepository.save(payment);
        return mapper.toPaymentResponse(saved);
    }

    @Override
    public List<PaymentResponse> getByReservationId(Long reservationId) {
        List<Payment>payments=paymentRepository.findByReservationId(reservationId);
        if (payments.isEmpty()) {
            throw new RuntimeException("Payment not found");
        }
        return payments.stream().map(mapper::toPaymentResponse).toList();
    }

    @Override
    public PaymentResponse getById(Long id) {
        Payment payment = paymentRepository.findById(id).orElseThrow(() -> new RuntimeException("Payment not found"));
        return mapper.toPaymentResponse(payment);
    }
}
