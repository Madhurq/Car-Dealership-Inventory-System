package com.dealership.inventory.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.dealership.inventory.model.Vehicle;

public interface VehicleRepository extends JpaRepository<Vehicle, Long> {

    @Query("SELECT v FROM Vehicle v WHERE " +
           "(:make IS NULL OR LOWER(v.make) LIKE :make) AND " +
           "(:model IS NULL OR LOWER(v.model) LIKE :model) AND " +
           "(:category IS NULL OR LOWER(v.category) LIKE :category) AND " +
           "(:minPrice IS NULL OR v.price >= :minPrice) AND " +
           "(:maxPrice IS NULL OR v.price <= :maxPrice)")
    List<Vehicle> searchVehicles(@Param("make") String make,
                                  @Param("model") String model,
                                  @Param("category") String category,
                                  @Param("minPrice") Double minPrice,
                                  @Param("maxPrice") Double maxPrice);
}
