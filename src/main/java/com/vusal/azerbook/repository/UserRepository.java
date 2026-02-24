package com.vusal.azerbook.repository;

import com.vusal.azerbook.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {

}
