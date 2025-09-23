package com.example.besideCoding.problemUpvote.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "problem_likes", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"user_id", "problem_id"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProblemLike {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "problem_id", nullable = false)
    private Long problemId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status;

    public enum Status {
        LIKE,
        DISLIKE
    }
}
