package com.dealership.inventory.dto;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class LoginRequestTest {

    private Validator validator;
    private ValidatorFactory factory;

    @BeforeEach
    void setUp() {
        factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    @AfterEach
    void tearDown() {
        if (factory != null) {
            factory.close();
        }
    }

    @Test
    void validLoginRequest_ShouldPassValidation() {
        var request = new LoginRequest("test@example.com", "password123");
        assertTrue(validator.validate(request).isEmpty());
    }

    @Test
    void loginRequestWithBlankEmail_ShouldFailValidation() {
        var request = new LoginRequest("", "password123");
        assertFalse(validator.validate(request).isEmpty());
    }

    @Test
    void loginRequestWithInvalidEmail_ShouldFailValidation() {
        var request = new LoginRequest("not-an-email", "password123");
        assertFalse(validator.validate(request).isEmpty());
    }

    @Test
    void loginRequestWithBlankPassword_ShouldFailValidation() {
        var request = new LoginRequest("test@example.com", "");
        assertFalse(validator.validate(request).isEmpty());
    }

    @Test
    void loginRequestWithNullEmail_ShouldFailValidation() {
        var request = new LoginRequest(null, "password123");
        assertFalse(validator.validate(request).isEmpty());
    }

    @Test
    void loginRequestWithNullPassword_ShouldFailValidation() {
        var request = new LoginRequest("test@example.com", null);
        assertFalse(validator.validate(request).isEmpty());
    }
}
