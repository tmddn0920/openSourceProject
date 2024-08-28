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
    
    // 해파리뷰 자체 등급

    @Autowired
    private ReviewRepository reviewRepository;

    public static long countChar(String str, char ch) {
        return str.chars()
                .filter(c -> c == ch)
                .count();
    }

    public static long countSubstring(String str, String substring) {
        int substringLength = substring.length();
        return (str.length() - str.replace(substring, "").length()) / substringLength;
    }

    public double calculateTrustworthiness(Long productId) {
        List<Review> reviews = reviewRepository.findByProductId(productId);

        double totalTrustworthiness = 0;

        for (Review review : reviews) {

            totalTrustworthiness += review.getRating() * review.getContent().length();

            // for(int i = 0; i < review.getContent().length(); i++){ }

            totalTrustworthiness += 
                (countChar(review.getContent(), '!') + countChar(review.getContent(), '좋') + countSubstring(review.getContent(), "재구매")
                - countSubstring(review.getContent(), "별로") - countSubstring(review.getContent(), "나쁘")) * 10;
        }

        double result = 0;

        double x = totalTrustworthiness / reviews.size();

        if (x < 300) { result = x / 80; }
        else if (x >= 300 && x < 600) { result = x / 150; }
        else if (x >= 600 && x < 800) { result = x / 165; }
        else if (x >= 800 && x < 1000) { result = x / 240; }
        else if (x >= 1000 && x < 1200) { result = x / 300; }
        else if (x >= 1200 && x < 1400) { result = x / 350; }
        else if (x >= 1400 && x < 1600) { result = x / 380; }
        else if (x >= 1600 && x < 1800) { result = x / 500; }
        else if (x >= 1800 && x < 2800) { result = x / 600; }

        if (result > 5.0) { return 0; }

        return result;
    }
    
}