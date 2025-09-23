package com.example.besideCoding.submission.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "problem_submitted")
@Data
public class ProblemSubmitted {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "problem_id", nullable = false)
    private int problemId;

    @Column(name = "user_id", nullable = false)
    private int userId;

    @Column(name = "submitted_time", nullable = false)
    private LocalDateTime submittedTime = LocalDateTime.now();

    @Column(name = "submitted_status", nullable = false)
    private String submittedStatus;
}
