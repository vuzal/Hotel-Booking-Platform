package com.vusal.azerbook.model.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class UserUpdateRequest {

    @NotBlank(message = "First name is required")
    private String firstName;
    @NotBlank(message = "Last name is required")
    private String lastName;
    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^(?:\\+994|0)(50|51|55|70|77|99|10|60)\\d{7}$")
    private String phone;
}
