package com.petplatform.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {
    @Id
    private String id;

    @Column(nullable = false)
    private String name;

    private String category;
    private String petType;
    private Double price;
    private Double originalPrice;
    private Integer stock;
    private String imageUrl;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String brand;
    private Double rating;
    private Integer reviewCount;
}

