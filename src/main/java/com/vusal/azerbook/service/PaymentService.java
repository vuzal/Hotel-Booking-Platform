package com.vusal.azerbook.service;

import com.vusal.azerbook.dto.request.PaymentCreateRequest;
import com.vusal.azerbook.dto.response.PaymentResponse;
import com.vusal.azerbook.enums.PaymentMethod;

import java.util.List;

public interface PaymentService {

    PaymentResponse create(PaymentCreateRequest request);

    PaymentResponse processPayment(Long reservationId, PaymentMethod method);

    List<PaymentResponse> getByReservationId(Long reservationId);

    PaymentResponse getById(Long id);
}
