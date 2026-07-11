package com.dealership.inventory.repo;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

import com.dealership.inventory.model.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class UserRepositoryTest {

    private final UserRepository userRepository;

    @Autowired
    UserRepositoryTest(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Test
    void saveUser_ShouldPersistAndAssignId() {
        var user = new User("test@example.com", "password123", "ROLE_USER");

        var saved = userRepository.save(user);

        assertThat(saved.getId()).isNotNull();
        assertThat(saved.getEmail()).isEqualTo("test@example.com");
    }

    @Test
    void findByEmail_ShouldReturnUser_WhenExists() {
        var user = new User("find@example.com", "password123", "ROLE_USER");
        userRepository.save(user);

        var found = userRepository.findByEmail("find@example.com");

        assertThat(found).isPresent();
        assertThat(found.get().getEmail()).isEqualTo("find@example.com");
    }

    @Test
    void findByEmail_ShouldReturnEmpty_WhenNotFound() {
        var found = userRepository.findByEmail("nonexistent@example.com");

        assertThat(found).isEmpty();
    }
}
