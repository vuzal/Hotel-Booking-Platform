package com.vusal.azerbook.service;

import com.vusal.azerbook.model.request.PaymentCreateRequest;
import com.vusal.azerbook.model.response.PaymentResponse;
import com.vusal.azerbook.enums.PaymentMethod;

import java.util.List;

public interface PaymentService {

    PaymentResponse create(PaymentCreateRequest request);

    PaymentResponse processPayment(Long reservationId, PaymentMethod method);

    List<PaymentResponse> getByReservationId(Long reservationId);

    PaymentResponse getById(Long id);
}
