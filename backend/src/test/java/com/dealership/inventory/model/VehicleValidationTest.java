package com.dealership.inventory.model;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;

public class VehicleValidationTest {
    private Validator validator;

    @BeforeEach
    void setUp() {
        try (ValidatorFactory factory = Validation.buildDefaultValidatorFactory()) {
            validator = factory.getValidator();
        }
    }

    @Test
    void validVehicle_ShouldPassValidation() {
        Vehicle vehicle = new Vehicle("Toyota", "Camry", "Sedan", 25000.0, 10);
        assertTrue(validator.validate(vehicle).isEmpty(), "Valid vehicle should have no constraint violations");
    }

    @Test
    void vehicleWithBlankMake_ShouldFailValidation() {
        Vehicle vehicle = new Vehicle("", "Camry", "Sedan", 25000.0, 10);
        assertFalse(validator.validate(vehicle).isEmpty(), "Vehicle with blank make must fail validation");
    }

    @Test
    void vehicleWithNegativePrice_ShouldFailValidation() {
        Vehicle vehicle = new Vehicle("Toyota", "Camry", "Sedan", -500.0, 10);
        assertFalse(validator.validate(vehicle).isEmpty(), "Vehicle with negative price must fail validation");
    }
}
