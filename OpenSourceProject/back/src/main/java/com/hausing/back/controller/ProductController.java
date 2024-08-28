package com.hausing.back.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hausing.back.service.ReviewService;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/products")
public class ProductController {
    
    @Autowired
    private ReviewService reviewService;

    @GetMapping("/trustworthiness/{id}")
    public double getTrustworthiness(@PathVariable Long id) {
        return reviewService.calculateTrustworthiness(id);
    }
    
}
