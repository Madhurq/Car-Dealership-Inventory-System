package com.dealership.inventory.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.dealership.inventory.dto.VehicleRequest;
import com.dealership.inventory.exception.ResourceNotFoundException;
import com.dealership.inventory.model.Vehicle;
import com.dealership.inventory.repo.VehicleRepository;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class VehicleServiceTest {

    @Mock
    private VehicleRepository vehicleRepository;

    @InjectMocks
    private VehicleService vehicleService;

    @Test
    void findAll_ShouldReturnAllVehicles() {
        var vehicles = List.of(
                new Vehicle("Toyota", "Camry", "Sedan", 25000.0, 10),
                new Vehicle("Honda", "Civic", "Sedan", 22000.0, 5)
        );
        when(vehicleRepository.findAll()).thenReturn(vehicles);

        var result = vehicleService.findAll();

        assertThat(result).hasSize(2);
        verify(vehicleRepository).findAll();
    }

    @Test
    void findById_ShouldReturnVehicle_WhenExists() {
        var vehicle = new Vehicle("Toyota", "Camry", "Sedan", 25000.0, 10);
        when(vehicleRepository.findById(1L)).thenReturn(Optional.of(vehicle));

        var result = vehicleService.findById(1L);

        assertThat(result).isEqualTo(vehicle);
    }

    @Test
    void findById_ShouldThrow_WhenNotFound() {
        when(vehicleRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> vehicleService.findById(99L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("99");
    }

    @Test
    void createVehicle_ShouldPersistAndReturn() {
        var request = new VehicleRequest("Toyota", "Camry", "Sedan", 25000.0, 10);
        when(vehicleRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

        var result = vehicleService.create(request);

        assertThat(result.getMake()).isEqualTo("Toyota");
        assertThat(result.getQuantity()).isEqualTo(10);
        verify(vehicleRepository).save(any());
    }

    @Test
    void updateVehicle_ShouldUpdateFieldsAndReturn() {
        var existing = new Vehicle("Toyota", "Camry", "Sedan", 25000.0, 10);
        var request = new VehicleRequest("Honda", "Accord", "Sedan", 28000.0, 8);
        when(vehicleRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(vehicleRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

        var result = vehicleService.update(1L, request);

        assertThat(result.getMake()).isEqualTo("Honda");
        assertThat(result.getQuantity()).isEqualTo(8);
        verify(vehicleRepository).save(existing);
    }

    @Test
    void deleteVehicle_ShouldDeleteById() {
        var vehicle = new Vehicle("Toyota", "Camry", "Sedan", 25000.0, 10);
        when(vehicleRepository.findById(1L)).thenReturn(Optional.of(vehicle));

        vehicleService.delete(1L);

        verify(vehicleRepository).deleteById(1L);
    }

    @Test
    void purchaseVehicle_ShouldDecreaseQuantityByOne() {
        var vehicle = new Vehicle("Toyota", "Camry", "Sedan", 25000.0, 10);
        when(vehicleRepository.findById(1L)).thenReturn(Optional.of(vehicle));
        when(vehicleRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

        var result = vehicleService.purchase(1L);

        assertThat(result.getQuantity()).isEqualTo(9);
        verify(vehicleRepository).save(vehicle);
    }

    @Test
    void purchaseVehicle_ShouldThrow_WhenOutOfStock() {
        var vehicle = new Vehicle("Toyota", "Camry", "Sedan", 25000.0, 0);
        when(vehicleRepository.findById(1L)).thenReturn(Optional.of(vehicle));

        assertThatThrownBy(() -> vehicleService.purchase(1L))
                .isInstanceOf(IllegalStateException.class);
    }

    @Test
    void restockVehicle_ShouldIncreaseQuantity() {
        var vehicle = new Vehicle("Toyota", "Camry", "Sedan", 25000.0, 10);
        when(vehicleRepository.findById(1L)).thenReturn(Optional.of(vehicle));
        when(vehicleRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

        var result = vehicleService.restock(1L, 5);

        assertThat(result.getQuantity()).isEqualTo(15);
        verify(vehicleRepository).save(vehicle);
    }
}
