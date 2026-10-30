package com.petplatform.controller;

import com.petplatform.model.Order;
import com.petplatform.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    // View My Orders
    @GetMapping("/my-orders")
    public ResponseEntity<List<Order>> getMyOrders(
            @RequestParam(defaultValue = "usr-101") String userId,
            @RequestParam(required = false) String status) {
        if (status != null && !status.equalsIgnoreCase("ALL")) {
            return ResponseEntity.ok(orderRepository.findByUserIdAndStatus(userId, status));
        }
        return ResponseEntity.ok(orderRepository.findByUserId(userId));
    }

    // View Order Details
    @GetMapping("/{orderId}")
    public ResponseEntity<Order> getOrderById(@PathVariable String orderId) {
        return orderRepository.findById(orderId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Update Submitted Order (Receiver info)
    @PutMapping("/{orderId}/receiver")
    public ResponseEntity<Order> updateSubmittedOrder(
            @PathVariable String orderId,
            @RequestBody Order updatedInfo) {
        return orderRepository.findById(orderId).map(order -> {
            if ("PENDING".equals(order.getStatus())) {
                order.setReceiverName(updatedInfo.getReceiverName());
                order.setReceiverPhone(updatedInfo.getReceiverPhone());
                order.setReceiverAddress(updatedInfo.getReceiverAddress());
                order.setReceiverNote(updatedInfo.getReceiverNote());
                return ResponseEntity.ok(orderRepository.save(order));
            }
            return ResponseEntity.badRequest().<Order>build();
        }).orElse(ResponseEntity.notFound().build());
    }

    // Cancel Submitted Order
    @PutMapping("/{orderId}/cancel")
    public ResponseEntity<Order> cancelSubmittedOrder(
            @PathVariable String orderId,
            @RequestParam(defaultValue = "Đổi ý không mua nữa") String reason) {
        return orderRepository.findById(orderId).map(order -> {
            if ("PENDING".equals(order.getStatus()) || "PROCESSING".equals(order.getStatus())) {
                order.setStatus("CANCELLED");
                return ResponseEntity.ok(orderRepository.save(order));
            }
            return ResponseEntity.badRequest().<Order>build();
        }).orElse(ResponseEntity.notFound().build());
    }
}

