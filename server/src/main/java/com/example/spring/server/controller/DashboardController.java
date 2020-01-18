package com.example.spring.server.controller;

import com.example.spring.server.model.ApplicationUser;
import com.example.spring.server.model.ApplicationPoint;
import com.example.spring.server.repository.PointsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

@RestController
@RequestMapping("/")
public class DashboardController {

    @Autowired
    PointsRepository pointsRepository;

    @GetMapping("/dashboard")
    public Map<String, Object> loadDashboard(HttpServletRequest request, HttpServletResponse resp) {
        HashMap<String, Object> response = new HashMap<>();
        response.put("data", pointsRepository.findAll());
        response.put("lk",SheetTest.getResult());
        return response;
    }

    @PostMapping("/submit")
    public Map<String, Object> loadDashboard(@RequestBody MultiValueMap<String, String> paramMap, HttpServletRequest request, HttpServletResponse resp) {
        HashMap<String, Object> response = new HashMap<>();
        float X = Float.parseFloat(Objects.requireNonNull(paramMap.getFirst("X")));
        float Y = Float.parseFloat(Objects.requireNonNull(paramMap.getFirst("Y")));
        float R = Float.parseFloat(Objects.requireNonNull(paramMap.getFirst("R")));
        boolean result = isThisShitWorking(X,Y,R);
        ApplicationUser applicationUser = (ApplicationUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        System.out.println(X);
        System.out.println(Y);
        System.out.println(R);
        System.out.println(applicationUser.getUsername());
        System.out.println(result);
        System.out.println(SheetTest.getResult());

        ApplicationPoint applicationPoint = new ApplicationPoint();
        applicationPoint.setX(X);
        applicationPoint.setY(Y);
        applicationPoint.setR(R);
        applicationPoint.setUsername(applicationUser.getUsername());
        applicationPoint.setResult(result);
        ApplicationPoint createdApplicationPoint = pointsRepository.save(applicationPoint);

        response.put("data", pointsRepository.findAll());
        response.put("lk",SheetTest.getResult());
        return response;
    }

    private boolean isThisShitWorking(float x, float y, float r) {
        return ((x >= -r/2 && x <= 0 && y <= r && y >= 0) ||
                (y <= 0 && x <= 0 && y >= - 2*x - r) ||
                (x >= 0 && y >= 0 && x*x + y*y <= r*r/4));
    }
}
