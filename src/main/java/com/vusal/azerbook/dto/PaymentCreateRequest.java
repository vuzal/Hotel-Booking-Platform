package com.vusal.azerbook.dto;

import com.vusal.azerbook.enums.PaymentMethod;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PaymentCreateRequest {

    @NotNull(message = "Reservation Id is required")
    Long reservationId;

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Amount must be greater than 0")
    BigDecimal amount;

    @NotNull(message = "Payment method is required")
    PaymentMethod method;

}
