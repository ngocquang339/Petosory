package com.petplatform.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "spas")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Spa {
    @Id
    private String id;

    @Column(nullable = false)
    private String name;

    private String city;
    private String address;
    private String phone;
    private Double latitude;
    private Double longitude;
    private Double rating;
    private Integer reviewCount;
    private String openTime;
    private String imageUrl;
    private Boolean verified;
}

