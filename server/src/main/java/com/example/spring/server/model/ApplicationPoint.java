package com.example.spring.server.model;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.Collection;

@Entity
@Table(name = "POINTS")
public class ApplicationPoint extends AuditModel {

    @Id
    @GeneratedValue(generator = "user_generator")
    @SequenceGenerator(
            name = "user_generator",
            sequenceName = "user_sequence",
            initialValue = 1000
    )
    private Long id;

    @NotNull
    private Float X;

    @NotNull
    private Float Y;

    @NotNull
    private Float R;

    @NotBlank
    @Size(min = 3, max = 100)
    private String username;

    @Column(columnDefinition = "text")
    private boolean result;

    public String getUsername() {
        return username;
    }

    public void setUsername(String name) {
        this.username = name;
    }

    public void setR(Float r) {
        R = r;
    }

    public void setX(Float x) {
        X = x;
    }

    public void setY(Float y) {
        Y = y;
    }

    public void setResult(boolean result) {
        this.result = result;
    }

    public Float getR() {
        return R;
    }

    public Float getX() {
        return X;
    }

    public Float getY() {
        return Y;
    }

    public boolean getResult() {
        return result;
    }
}
