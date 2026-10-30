package com.petplatform.controller;

import com.petplatform.model.Product;
import com.petplatform.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search) {
        if (category != null && !category.equalsIgnoreCase("all")) {
            return ResponseEntity.ok(productRepository.findByCategory(category));
        }
        if (search != null && !search.trim().isEmpty()) {
            return ResponseEntity.ok(productRepository.findByNameContainingIgnoreCase(search));
        }
        return ResponseEntity.ok(productRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable String id) {
        return productRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}

