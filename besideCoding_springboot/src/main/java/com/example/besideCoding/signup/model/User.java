package com.example.besideCoding.signup.model;

import jakarta.persistence.*;
import lombok.Data;
import java.sql.Timestamp;

@Entity
@Table(name = "user")
@Data
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String name;
    private String email;
    @Column(name = "password", nullable = true) // <-- CHANGE THIS
    private String password;

    @Column(name = "bio")
    private String bio;

    private String college_or_company;

    @Column(name = "google_id")
    private String googleId;

    @Column(name = "linkedin_id")
    private String linkedinId;

    @Column(name = "github_id")
    private String githubId;

    @Column(name = "portfolio_link")
    private String portfolioLink;

    private int coins = 0;
    private int total_problems_solved = 0;
    private int streak = 0;
    private float rating = 0;
    private int user_rank = 0;
    private boolean is_admin = false;

    @Column(columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private Timestamp created_date;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "ENUM('active', 'inactive', 'banned') DEFAULT 'active'")
    private Status status = Status.active;

    private String badge;

    public enum Status {
        active, inactive, banned
    }

    @Column(name = "profile_pic")
    private String profilePic;

    // Getters and Setters
}

