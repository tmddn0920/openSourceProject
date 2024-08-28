package com.hausing.back.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hausing.back.entity.Review;
import com.hausing.back.repository.ReviewRepository;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    public static long countChar(String str, char ch) {
        return str.chars()
                .filter(c -> c == ch)
                .count();
    }

    public double calculateTrustworthiness(Long productId) {
        List<Review> reviews = reviewRepository.findByProductId(productId);

        double totalTrustworthiness = 0;

        for (Review review : reviews) {

            totalTrustworthiness += review.getRating() * review.getContent().length();

            // for(int i = 0; i < review.getContent().length(); i++){ }

            totalTrustworthiness += (countChar(review.getContent(), '!') + countChar(review.getContent(), '좋')) * 10;
        }

        return totalTrustworthiness / reviews.size() / 350;
    }
    
}