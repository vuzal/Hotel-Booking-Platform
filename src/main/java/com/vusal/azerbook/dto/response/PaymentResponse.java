package com.vusal.azerbook.dto.response;

import com.vusal.azerbook.enums.PaymentMethod;
import com.vusal.azerbook.enums.PaymentStatus;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PaymentResponse {

    Long id;
    BigDecimal amount;
    PaymentMethod method;
    PaymentStatus status;
    LocalDateTime createdAt;
}

