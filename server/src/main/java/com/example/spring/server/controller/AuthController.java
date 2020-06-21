package com.example.spring.server.controller;

import com.example.spring.server.exception.ResourceNotFoundException;
import com.example.spring.server.model.ApplicationUser;
import com.example.spring.server.repository.UserRepository;
import com.example.spring.server.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import java.util.HashMap;
import java.util.Map;

import static com.example.spring.server.utils.Constants.COOKIE_EXPIRATION_TIME;
import static com.example.spring.server.utils.Constants.SESSION_COOKIE_NAME;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    BCryptPasswordEncoder passwordEncoder;

    @Autowired
    JwtTokenProvider tokenProvider;

    @PostMapping(path = "/register", produces = MediaType.APPLICATION_JSON_VALUE, consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    public Map<String, Object> register(@Valid @RequestBody MultiValueMap paramMap) {
        HashMap<String, Object> response = new HashMap<>();
        String username = (String) paramMap.getFirst("username");
        String email = (String) paramMap.getFirst("email");
        String password = (String) paramMap.getFirst("password");
        if (username != null && email != null && password != null) {
            ApplicationUser applicationUser = userRepository.findByUsername(username);
            if (applicationUser == null) {
                applicationUser = userRepository.findByEmail(email);
                if (applicationUser == null) {
                    applicationUser = new ApplicationUser();
                    applicationUser.setUsername(username);
                    applicationUser.setPassword(passwordEncoder.encode(password));
                    applicationUser.setEmail(email);
                    ApplicationUser createdApplicationUser = userRepository.save(applicationUser);
                    if (createdApplicationUser != null) {
                        response.put("message", "User successfully created");
                        return response;
                    } else {
                        response.put("error", "Internal Server Error");
                        return response;
                    }
                } else {
                    response.put("error", "User with this email already exists");
                    return response;
                }
            } else {
                response.put("error", "User with this username already exists");
                return response;
            }
        } else {
            response.put("error", "Invalid request");
            return response;
        }
    }

    @PostMapping(path = "/login", produces = MediaType.APPLICATION_JSON_VALUE, consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    public Map<String, Object> signin(@Valid @RequestBody MultiValueMap paramMap, HttpServletRequest request, HttpServletResponse resp) {
        HashMap<String, Object> response = new HashMap<>();
        String username = (String) paramMap.getFirst("username");
        String password = (String) paramMap.getFirst("password");

        resp.setHeader("Access-Control-Allow-Origin", request.getHeader("origin"));
        resp.setHeader("Access-Control-Allow-Credentials", "true");

        try {
            if (username != null && password != null) {
                ApplicationUser applicationUser = userRepository.findByUsername(username);
                if (applicationUser != null) {
                    boolean isPasswordValid = passwordEncoder.matches(password, applicationUser.getPassword());
                    if (isPasswordValid) {
                        Authentication authentication = authenticationManager.authenticate(
                                new UsernamePasswordAuthenticationToken(
                                        username,
                                        password
                                )
                        );
                        SecurityContextHolder.getContext().setAuthentication(authentication);
                        String jwt = tokenProvider.generateToken(authentication);

                        Cookie cookie = new Cookie(SESSION_COOKIE_NAME, jwt);
                        cookie.setPath("/");
                        cookie.setMaxAge(COOKIE_EXPIRATION_TIME);
                        resp.addCookie(cookie);

                        response.put("message", "User login successful");
                        return response;
                    } else {
                        response.put("error", "Invalid username or password");
                        return response;
                    }
                } else {
                    response.put("error", "Invalid username or password");
                    return response;
                }
            }
        } catch (Exception e) {
            System.out.print(e.getMessage());
        }
        response.put("error", "Invalid request");
        return response;
    }

    @GetMapping(path = "/logout")
    public Map<String, Object> logout(HttpServletRequest request, HttpServletResponse resp) {
        HashMap<String, Object> response = new HashMap<>();

        resp.setHeader("Access-Control-Allow-Origin", request.getHeader("origin"));
        resp.setHeader("Access-Control-Allow-Credentials", "true");
        resp.setContentType("text/html");

        String jwt = (String) SecurityContextHolder.getContext().getAuthentication().getCredentials();
        Cookie[] cookies = request.getCookies();
        Cookie cookie = new Cookie(SESSION_COOKIE_NAME, jwt);
        cookie.setPath("/");
        cookie.setMaxAge(0);
        resp.addCookie(cookie);

        if(cookies != null) {
            for (int i = 0; i < cookies.length; i++) {
                cookie = cookies[i];
                cookie.setPath("/");
                cookie.setMaxAge(0);
                resp.addCookie(cookie);
            }}

        response.put("message", "User logout successful");
        return response;
    }

    @GetMapping("/user")
    public Map<String, Object> getUser() {
        HashMap<String, Object> response = new HashMap<>();
        ApplicationUser applicationUser = (ApplicationUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        response.put("username", applicationUser.getUsername());
        response.put("email", applicationUser.getEmail());
        return response;
    }

    @PutMapping("/user")
    public ApplicationUser updateUser(@PathVariable Long userId, @Valid @RequestBody ApplicationUser applicationUserRequest) {
        return userRepository.findById(userId)
                .map(user -> {
                    user.setUsername(applicationUserRequest.getUsername());
                    user.setEmail(applicationUserRequest.getEmail());
                    return userRepository.save(user);
                }).orElseThrow(() -> new ResourceNotFoundException("ApplicationUser not found with id " + userId));
    }

    @DeleteMapping("/user")
    public ResponseEntity<?> deleteUser(@PathVariable Long userId) {
        return userRepository.findById(userId)
                .map(user -> {
                    userRepository.delete(user);
                    return ResponseEntity.ok().build();
                }).orElseThrow(() -> new ResourceNotFoundException("ApplicationUser not found with id " + userId));
    }
}
