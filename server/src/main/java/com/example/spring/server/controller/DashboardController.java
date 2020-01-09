package com.example.spring.server.controller;

import com.example.spring.server.exception.ResourceNotFoundException;
import com.example.spring.server.model.ApplicationUser;
import com.example.spring.server.model.ApplicationPoint;
import com.example.spring.server.repository.UserRepository;
import com.example.spring.server.repository.PointsRepository;
import com.example.spring.server.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import com.example.spring.server.controller.SheetTest;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import java.util.HashMap;
import java.util.Map;

import static com.example.spring.server.utils.Constants.COOKIE_EXPIRATION_TIME;
import static com.example.spring.server.utils.Constants.SESSION_COOKIE_NAME;
import static java.util.Collections.emptyList;

@RestController
@RequestMapping("/")
public class DashboardController {

    @Autowired
    PointsRepository pointsRepository;

    @GetMapping("/dashboard")
    public Map<String, Object> loadDashboard(HttpServletRequest request, HttpServletResponse resp) {
        HashMap<String, Object> response = new HashMap<>();
        response.put("data", pointsRepository.findAll());
        return response;
    }

    @PostMapping("/submit")
    public Map<String, Object> loadDashboard(@Valid @RequestBody MultiValueMap paramMap, HttpServletRequest request, HttpServletResponse resp) {
        HashMap<String, Object> response = new HashMap<>();
        SheetTest sheetTest = new SheetTest();
        float X = Float.parseFloat((String) paramMap.getFirst("X"));
        float Y = Float.parseFloat((String) paramMap.getFirst("Y"));
        float R = Float.parseFloat((String) paramMap.getFirst("R"));
        boolean result = isThisShitWorking(X,Y,R);
        ApplicationUser applicationUser = (ApplicationUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        System.out.println(X);
        System.out.println(Y);
        System.out.println(R);
        System.out.println(applicationUser.getUsername());
        System.out.println(result);
        System.out.println(sheetTest.getResult());

        ApplicationPoint applicationPoint = new ApplicationPoint();
        applicationPoint.setX(X);
        applicationPoint.setY(Y);
        applicationPoint.setR(R);
        applicationPoint.setUsername(applicationUser.getUsername());
        applicationPoint.setResult(result);
        ApplicationPoint createdApplicationPoint = pointsRepository.save(applicationPoint);

        response.put("data", pointsRepository.findAll());
        return response;
    }

    private boolean isThisShitWorking(float x, float y, float r) {
        return ((x >= -r/2 && x <= 0 && y <= r && y >= 0) ||
                (y <= 0 && x <= 0 && y >= - 2*x - r) ||
                (x >= 0 && y >= 0 && x*x + y*y <= r*r/4));
    }
}
