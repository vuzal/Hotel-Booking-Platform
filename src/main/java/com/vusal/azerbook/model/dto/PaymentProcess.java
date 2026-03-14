package com.vusal.azerbook.model.dto;

import com.vusal.azerbook.enums.PaymentMethod;

public record PaymentProcess(
        PaymentMethod method
) {
}
