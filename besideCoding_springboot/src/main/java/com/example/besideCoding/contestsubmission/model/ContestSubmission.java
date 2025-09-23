package com.example.besideCoding.contestsubmission.model;

import jakarta.persistence.*;
import lombok.*;

import java.sql.Timestamp;

@Entity
@Table(name = "contest_submissions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContestSubmission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private int userId;
    private int contestId;
    private int problemId;

    @Column(columnDefinition = "TEXT")
    private String answer;

    private boolean isCorrect;

    private Timestamp submittedAt;

    @PrePersist
    public void onCreate() {
        this.submittedAt = new Timestamp(System.currentTimeMillis());
    }
}
