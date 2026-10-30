package com.petplatform.repository;

import com.petplatform.model.Spa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SpaRepository extends JpaRepository<Spa, String> {
    List<Spa> findByCity(String city);
    List<Spa> findByNameContainingIgnoreCase(String name);
}

