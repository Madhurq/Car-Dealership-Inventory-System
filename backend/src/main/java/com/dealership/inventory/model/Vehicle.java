package com.dealership.inventory.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Vehicle {
    private Long id;
    private String make;
    private String model;
    private String category;
    private Double price;
    private Integer quantity;

    public Vehicle(String make, String model, String category, Double price, Integer quantity) {
        this.make = make;
        this.model = model;
        this.category = category;
        this.price = price;
        this.quantity = quantity;
    }
}
