package com.vusal.azerbook.repository;

import com.vusal.azerbook.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

}
