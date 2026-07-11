package com.dealership.inventory.dto;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class RegisterRequestTest {

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
    void validRegisterRequest_ShouldPassValidation() {
        var request = new RegisterRequest("new@example.com", "securePass1");
        assertTrue(validator.validate(request).isEmpty());
    }

    @Test
    void registerRequestWithBlankEmail_ShouldFailValidation() {
        var request = new RegisterRequest("", "securePass1");
        assertFalse(validator.validate(request).isEmpty());
    }

    @Test
    void registerRequestWithInvalidEmail_ShouldFailValidation() {
        var request = new RegisterRequest("bad-email", "securePass1");
        assertFalse(validator.validate(request).isEmpty());
    }

    @Test
    void registerRequestWithBlankPassword_ShouldFailValidation() {
        var request = new RegisterRequest("new@example.com", "");
        assertFalse(validator.validate(request).isEmpty());
    }

    @Test
    void registerRequestWithNullEmail_ShouldFailValidation() {
        var request = new RegisterRequest(null, "securePass1");
        assertFalse(validator.validate(request).isEmpty());
    }

    @Test
    void registerRequestWithNullPassword_ShouldFailValidation() {
        var request = new RegisterRequest("new@example.com", null);
        assertFalse(validator.validate(request).isEmpty());
    }
}
