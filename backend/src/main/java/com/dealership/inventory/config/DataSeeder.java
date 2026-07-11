package com.dealership.inventory.config;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.dealership.inventory.model.User;
import com.dealership.inventory.model.Vehicle;
import com.dealership.inventory.repo.UserRepository;
import com.dealership.inventory.repo.VehicleRepository;

@Component
public class DataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

    private final UserRepository userRepository;
    private final VehicleRepository vehicleRepository;
    private final PasswordEncoder passwordEncoder;
    private final String adminEmail;
    private final String adminPassword;

    public DataSeeder(UserRepository userRepository,
                       VehicleRepository vehicleRepository,
                       PasswordEncoder passwordEncoder,
                       @Value("${app.admin.email:admin@dealership.com}") String adminEmail,
                       @Value("${app.admin.password:admin123}") String adminPassword) {
        this.userRepository = userRepository;
        this.vehicleRepository = vehicleRepository;
        this.passwordEncoder = passwordEncoder;
        this.adminEmail = adminEmail;
        this.adminPassword = adminPassword;
    }

    @Override
    public void run(String... args) {
        if (userRepository.findByEmail(adminEmail).isEmpty()) {
            var admin = new User(adminEmail, passwordEncoder.encode(adminPassword), "ROLE_ADMIN");
            userRepository.save(admin);
            log.info("Seeded admin user: {}", adminEmail);
        }

        if (vehicleRepository.count() == 0) {
            vehicleRepository.saveAll(List.of(
                new Vehicle("Toyota", "Camry", "Sedan", 28500.0, 12),
                new Vehicle("Honda", "Civic", "Sedan", 24900.0, 8),
                new Vehicle("BMW", "X5", "SUV", 62500.0, 5),
                new Vehicle("Ford", "Mustang", "Sports", 55000.0, 3),
                new Vehicle("Tesla", "Model 3", "Electric", 42000.0, 7),
                new Vehicle("Chevrolet", "Silverado", "Truck", 48500.0, 6)
            ));
            log.info("Seeded 6 vehicles");
        }
    }
}
