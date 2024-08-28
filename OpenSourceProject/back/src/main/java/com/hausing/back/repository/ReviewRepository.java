package com.hausing.back.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hausing.back.entity.Review;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long>{

    List<Review> findByProductId(Long productId);

}
