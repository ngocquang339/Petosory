package com.petplatform.controller;

import com.petplatform.model.Spa;
import com.petplatform.repository.SpaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/pet-map")
@CrossOrigin(origins = "*")
public class PetMapController {

    @Autowired
    private SpaRepository spaRepository;

    @GetMapping("/locations")
    public ResponseEntity<List<Spa>> getLocations(@RequestParam(defaultValue = "all") String city) {
        if (!city.equalsIgnoreCase("all")) {
            return ResponseEntity.ok(spaRepository.findByCity(city));
        }
        return ResponseEntity.ok(spaRepository.findAll());
    }
}

