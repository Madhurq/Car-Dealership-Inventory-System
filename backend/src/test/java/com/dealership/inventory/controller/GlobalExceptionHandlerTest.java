package com.dealership.inventory.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.dealership.inventory.config.SecurityConfig;
import com.dealership.inventory.service.JwtService;
import com.dealership.inventory.service.VehicleService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(VehicleController.class)
@Import(SecurityConfig.class)
@WithMockUser
class GlobalExceptionHandlerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private VehicleService vehicleService;

    @MockBean
    private JwtService jwtService;

    @Test
    void invalidRequestBody_ShouldReturn400WithErrorFields() throws Exception {
        var invalidBody = "{\"make\":\"\",\"model\":\"\",\"category\":\"\",\"price\":null,\"quantity\":null}";

        mockMvc.perform(post("/api/vehicles")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(invalidBody))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors").isArray())
                .andExpect(jsonPath("$.errors.length()").value(org.hamcrest.Matchers.greaterThan(0)));
    }

    @Test
    void missingRequestBody_ShouldReturn400() throws Exception {
        mockMvc.perform(post("/api/vehicles")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());
    }

    @Test
    void invalidPathVariable_ShouldReturn400() throws Exception {
        mockMvc.perform(get("/api/vehicles/not-a-number"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void resourceNotFound_ShouldReturn404WithJson() throws Exception {
        org.mockito.Mockito.when(vehicleService.findById(99L))
                .thenThrow(new com.dealership.inventory.exception.ResourceNotFoundException("Vehicle not found with id: 99"));

        mockMvc.perform(get("/api/vehicles/99"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.error").value("Vehicle not found with id: 99"));
    }
}
