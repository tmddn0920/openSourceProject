package com.hausing.back.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hausing.back.entity.Product;

public interface ProductRepository extends JpaRepository<Product, Long>{

}
