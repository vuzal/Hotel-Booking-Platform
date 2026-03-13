package com.vusal.azerbook.model.response;

import com.vusal.azerbook.enums.PaymentMethod;
import com.vusal.azerbook.enums.PaymentStatus;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class PaymentResponse {

    Long id;
    BigDecimal amount;
    PaymentMethod method;
    PaymentStatus status;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
}

