package com.dealership.inventory.service;

import com.dealership.inventory.dto.VehicleRequest;
import com.dealership.inventory.exception.ResourceNotFoundException;
import com.dealership.inventory.model.Vehicle;
import com.dealership.inventory.repo.VehicleRepository;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class VehicleService {

    private final VehicleRepository vehicleRepository;

    public VehicleService(VehicleRepository vehicleRepository) {
        this.vehicleRepository = vehicleRepository;
    }

    public List<Vehicle> findAll() {
        return vehicleRepository.findAll();
    }

    public List<Vehicle> search(String make, String model, String category,
                                 Double minPrice, Double maxPrice) {
        return vehicleRepository.searchVehicles(make, model, category, minPrice, maxPrice);
    }

    public Vehicle findById(Long id) {
        return vehicleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found with id: " + id));
    }

    public Vehicle create(VehicleRequest request) {
        var vehicle = new Vehicle(request.getMake(), request.getModel(),
                request.getCategory(), request.getPrice(), request.getQuantity());
        return vehicleRepository.save(vehicle);
    }

    public Vehicle update(Long id, VehicleRequest request) {
        var vehicle = findById(id);
        vehicle.setMake(request.getMake());
        vehicle.setModel(request.getModel());
        vehicle.setCategory(request.getCategory());
        vehicle.setPrice(request.getPrice());
        vehicle.setQuantity(request.getQuantity());
        return vehicleRepository.save(vehicle);
    }

    public void delete(Long id) {
        findById(id);
        vehicleRepository.deleteById(id);
    }

    public Vehicle purchase(Long id) {
        var vehicle = findById(id);
        if (vehicle.getQuantity() <= 0) {
            throw new IllegalStateException("Vehicle is out of stock");
        }
        vehicle.setQuantity(vehicle.getQuantity() - 1);
        return vehicleRepository.save(vehicle);
    }

    public Vehicle restock(Long id, int quantity) {
        var vehicle = findById(id);
        vehicle.setQuantity(vehicle.getQuantity() + quantity);
        return vehicleRepository.save(vehicle);
    }
}
