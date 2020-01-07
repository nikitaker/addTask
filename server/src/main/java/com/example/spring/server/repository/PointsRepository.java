package com.example.spring.server.repository;

import com.example.spring.server.model.ApplicationPoint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Repository;

@Repository
public interface PointsRepository extends JpaRepository<ApplicationPoint, Long> {

}
