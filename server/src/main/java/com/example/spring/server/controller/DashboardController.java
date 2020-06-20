package com.example.spring.server.controller;


import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/")
public class DashboardController {


    @GetMapping("/dashboard")
    public Map<String, Object> loadDashboard(HttpServletRequest request, HttpServletResponse resp) {
        HashMap<String, Object> response = new HashMap<>();
        return response;
    }


}
