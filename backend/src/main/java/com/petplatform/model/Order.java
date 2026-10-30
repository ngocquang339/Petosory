package com.petplatform.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order {
    @Id
    private String id;

    private String userId;
    private LocalDateTime orderDate;
    private String status;
    private Double totalAmount;
    private Double shippingFee;
    private Double discountAmount;

    private String receiverName;
    private String receiverPhone;
    private String receiverAddress;
    private String receiverNote;

    private String paymentMethod;
    private String paymentStatus;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    private List<OrderItem> items;
}

