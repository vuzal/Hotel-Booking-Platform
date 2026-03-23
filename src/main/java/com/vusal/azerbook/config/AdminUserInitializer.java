package com.vusal.azerbook.config;

import com.vusal.azerbook.model.entity.User;
import com.vusal.azerbook.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AdminUserInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // Əgər bazada bu email ilə user yoxdursa, admin yarat
        if (userRepository.findByEmail("admin@azerbook.com").isEmpty()) {
            User admin = User.builder()
                    .firstName("Admin")
                    .lastName("Vusal")
                    .email("admin@azerbook.com")
                    .password(passwordEncoder.encode("admin123")) // Şifrəniz
                    .phone("+994501112233")
                    .role("ADMIN") // Sənin sistemində rol necə tutulubsa (ENUM və ya String)
                    .isActive(true)
                    .build();

            userRepository.save(admin);
            System.out.println("--- ADMIN HESABI YARADILDI (admin@azerbook.com / admin123) ---");
        }
    }
}
