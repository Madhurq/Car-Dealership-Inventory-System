package com.dealership.inventory.dto;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class VehicleRequestTest {

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
    void validVehicleRequest_ShouldPassValidation() {
        var request = new VehicleRequest("Toyota", "Camry", "Sedan", 25000.0, 10);
        assertTrue(validator.validate(request).isEmpty());
    }

    @Test
    void vehicleRequestWithBlankMake_ShouldFailValidation() {
        var request = new VehicleRequest("", "Camry", "Sedan", 25000.0, 10);
        assertFalse(validator.validate(request).isEmpty());
    }

    @Test
    void vehicleRequestWithBlankModel_ShouldFailValidation() {
        var request = new VehicleRequest("Toyota", "", "Sedan", 25000.0, 10);
        assertFalse(validator.validate(request).isEmpty());
    }

    @Test
    void vehicleRequestWithBlankCategory_ShouldFailValidation() {
        var request = new VehicleRequest("Toyota", "Camry", "", 25000.0, 10);
        assertFalse(validator.validate(request).isEmpty());
    }

    @Test
    void vehicleRequestWithNegativePrice_ShouldFailValidation() {
        var request = new VehicleRequest("Toyota", "Camry", "Sedan", -500.0, 10);
        assertFalse(validator.validate(request).isEmpty());
    }

    @Test
    void vehicleRequestWithNullPrice_ShouldFailValidation() {
        var request = new VehicleRequest("Toyota", "Camry", "Sedan", null, 10);
        assertFalse(validator.validate(request).isEmpty());
    }

    @Test
    void vehicleRequestWithNegativeQuantity_ShouldFailValidation() {
        var request = new VehicleRequest("Toyota", "Camry", "Sedan", 25000.0, -1);
        assertFalse(validator.validate(request).isEmpty());
    }

    @Test
    void vehicleRequestWithNullQuantity_ShouldFailValidation() {
        var request = new VehicleRequest("Toyota", "Camry", "Sedan", 25000.0, null);
        assertFalse(validator.validate(request).isEmpty());
    }
}
