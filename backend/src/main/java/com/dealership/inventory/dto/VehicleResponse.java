package com.dealership.inventory.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class VehicleResponse {

    private Long id;
    private String make;
    private String model;
    private String category;
    private Double price;
    private Integer quantity;
}
