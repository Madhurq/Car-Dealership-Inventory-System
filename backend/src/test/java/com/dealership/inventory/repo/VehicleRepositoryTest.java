package com.dealership.inventory.repo;

import com.dealership.inventory.model.Vehicle;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.Optional;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class VehicleRepositoryTest {

    private final VehicleRepository vehicleRepository;

    @Autowired
    public VehicleRepositoryTest(VehicleRepository vehicleRepository){
        this.vehicleRepository = vehicleRepository;
    }

    @Test
    void saveVehicle_ShouldPersistToDatabase_AndAssignId() {

        Vehicle newVehicle = new Vehicle("Tesla", "Model 3", "Electric", 40000.0, 5);

        Vehicle savedVehicle = vehicleRepository.save(newVehicle);

        assertThat(savedVehicle.getId()).isNotNull();
        assertThat(savedVehicle.getMake()).isEqualTo("Tesla");
    }

    @Test
    void findById_ShouldReturnVehicle_WhenItExists() {

        Vehicle vehicle = new Vehicle("Ford", "Mustang", "Coupe", 35000.0, 2);
        Vehicle persisted = vehicleRepository.save(vehicle);

        Optional<Vehicle> found = vehicleRepository.findById(persisted.getId());

        assertThat(found).isPresent();
        found.ifPresent(value -> assertThat(value.getModel()).isEqualTo("Mustang"));//this will only trigger when found is present...
    }
}
