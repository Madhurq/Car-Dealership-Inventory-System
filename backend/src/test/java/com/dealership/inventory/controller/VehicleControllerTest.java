package com.dealership.inventory.controller;

import static org.hamcrest.Matchers.hasSize;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.dealership.inventory.dto.VehicleRequest;
import com.dealership.inventory.exception.ResourceNotFoundException;
import com.dealership.inventory.model.Vehicle;
import com.dealership.inventory.service.JwtService;
import com.dealership.inventory.service.VehicleService;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(VehicleController.class)
@WithMockUser
class VehicleControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private VehicleService vehicleService;

    @MockBean
    private JwtService jwtService;

    @Test
    void findAll_ShouldReturnList() throws Exception {
        var vehicle1 = new Vehicle("Toyota", "Camry", "Sedan", 25000.0, 10);
        vehicle1.setId(1L);
        var vehicle2 = new Vehicle("Honda", "Civic", "Sedan", 22000.0, 5);
        vehicle2.setId(2L);
        when(vehicleService.findAll()).thenReturn(List.of(vehicle1, vehicle2));

        mockMvc.perform(get("/api/vehicles"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].make").value("Toyota"))
                .andExpect(jsonPath("$[1].make").value("Honda"));
    }

    @Test
    void findById_ShouldReturnVehicle() throws Exception {
        var vehicle = new Vehicle("Toyota", "Camry", "Sedan", 25000.0, 10);
        vehicle.setId(1L);
        when(vehicleService.findById(1L)).thenReturn(vehicle);

        mockMvc.perform(get("/api/vehicles/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.make").value("Toyota"))
                .andExpect(jsonPath("$.model").value("Camry"));
    }

    @Test
    void findById_ShouldReturn404_WhenNotFound() throws Exception {
        when(vehicleService.findById(99L)).thenThrow(new ResourceNotFoundException("not found"));

        mockMvc.perform(get("/api/vehicles/99"))
                .andExpect(status().isNotFound());
    }

    @Test
    void create_ShouldReturn201() throws Exception {
        var request = new VehicleRequest("Toyota", "Camry", "Sedan", 25000.0, 10);
        var vehicle = new Vehicle("Toyota", "Camry", "Sedan", 25000.0, 10);
        vehicle.setId(1L);
        when(vehicleService.create(any(VehicleRequest.class))).thenReturn(vehicle);

        mockMvc.perform(post("/api/vehicles")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.make").value("Toyota"));
    }

    @Test
    void create_ShouldReturn400_WhenInvalid() throws Exception {
        var request = new VehicleRequest("", "", "", -1.0, -1);

        mockMvc.perform(post("/api/vehicles")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void update_ShouldReturnUpdated() throws Exception {
        var request = new VehicleRequest("Honda", "Accord", "Sedan", 28000.0, 8);
        var vehicle = new Vehicle("Honda", "Accord", "Sedan", 28000.0, 8);
        vehicle.setId(1L);
        when(vehicleService.update(eq(1L), any(VehicleRequest.class))).thenReturn(vehicle);

        mockMvc.perform(put("/api/vehicles/1")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.make").value("Honda"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void delete_ShouldReturn204() throws Exception {
        mockMvc.perform(delete("/api/vehicles/1").with(csrf()))
                .andExpect(status().isNoContent());

        verify(vehicleService).delete(1L);
    }

    @Test
    void delete_ShouldReturn403_WhenNotAdmin() throws Exception {
        mockMvc.perform(delete("/api/vehicles/1").with(csrf()))
                .andExpect(status().isForbidden());
    }

    @Test
    void purchase_ShouldReturnUpdated() throws Exception {
        var vehicle = new Vehicle("Toyota", "Camry", "Sedan", 25000.0, 9);
        vehicle.setId(1L);
        when(vehicleService.purchase(1L)).thenReturn(vehicle);

        mockMvc.perform(post("/api/vehicles/1/purchase").with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.quantity").value(9));
    }

    @Test
    void purchase_ShouldReturn409_WhenOutOfStock() throws Exception {
        when(vehicleService.purchase(1L)).thenThrow(new IllegalStateException("out of stock"));

        mockMvc.perform(post("/api/vehicles/1/purchase").with(csrf()))
                .andExpect(status().isConflict());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void restock_ShouldReturnUpdated() throws Exception {
        var vehicle = new Vehicle("Toyota", "Camry", "Sedan", 25000.0, 15);
        vehicle.setId(1L);
        when(vehicleService.restock(1L, 5)).thenReturn(vehicle);

        mockMvc.perform(post("/api/vehicles/1/restock")
                        .with(csrf())
                        .param("quantity", "5"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.quantity").value(15));
    }

    @Test
    void restock_ShouldReturn403_WhenNotAdmin() throws Exception {
        var vehicle = new Vehicle("Toyota", "Camry", "Sedan", 25000.0, 15);
        when(vehicleService.restock(1L, 5)).thenReturn(vehicle);

        mockMvc.perform(post("/api/vehicles/1/restock")
                        .with(csrf())
                        .param("quantity", "5"))
                .andExpect(status().isForbidden());
    }

    @Test
    void search_ByMake_ShouldReturnFiltered() throws Exception {
        var vehicle = new Vehicle("Toyota", "Camry", "Sedan", 25000.0, 10);
        vehicle.setId(1L);
        when(vehicleService.search(eq("Toyota"), any(), any(), any(), any()))
                .thenReturn(List.of(vehicle));

        mockMvc.perform(get("/api/vehicles/search")
                        .param("make", "Toyota"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].make").value("Toyota"));
    }

    @Test
    void search_ByModel_ShouldReturnFiltered() throws Exception {
        var vehicle = new Vehicle("Honda", "Civic", "Sedan", 22000.0, 5);
        vehicle.setId(1L);
        when(vehicleService.search(any(), eq("Civic"), any(), any(), any()))
                .thenReturn(List.of(vehicle));

        mockMvc.perform(get("/api/vehicles/search")
                        .param("model", "Civic"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].model").value("Civic"));
    }

    @Test
    void search_ByCategory_ShouldReturnFiltered() throws Exception {
        var vehicle = new Vehicle("Toyota", "Camry", "SUV", 35000.0, 7);
        vehicle.setId(1L);
        when(vehicleService.search(any(), any(), eq("SUV"), any(), any()))
                .thenReturn(List.of(vehicle));

        mockMvc.perform(get("/api/vehicles/search")
                        .param("category", "SUV"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].category").value("SUV"));
    }

    @Test
    void search_ByPriceRange_ShouldReturnFiltered() throws Exception {
        var vehicle = new Vehicle("Toyota", "Camry", "Sedan", 25000.0, 10);
        vehicle.setId(1L);
        when(vehicleService.search(any(), any(), any(), eq(20000.0), eq(30000.0)))
                .thenReturn(List.of(vehicle));

        mockMvc.perform(get("/api/vehicles/search")
                        .param("minPrice", "20000")
                        .param("maxPrice", "30000"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].price").value(25000.0));
    }

    @Test
    void search_WithNoParams_ShouldReturnAll() throws Exception {
        var vehicles = List.of(
                new Vehicle("Toyota", "Camry", "Sedan", 25000.0, 10),
                new Vehicle("Honda", "Civic", "Sedan", 22000.0, 5)
        );
        when(vehicleService.search(any(), any(), any(), any(), any()))
                .thenReturn(vehicles);

        mockMvc.perform(get("/api/vehicles/search"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)));
    }

    @Test
    void search_WithNoMatches_ShouldReturnEmpty() throws Exception {
        when(vehicleService.search(any(), any(), any(), any(), any()))
                .thenReturn(List.of());

        mockMvc.perform(get("/api/vehicles/search")
                        .param("make", "NonExistent"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));
    }
}
