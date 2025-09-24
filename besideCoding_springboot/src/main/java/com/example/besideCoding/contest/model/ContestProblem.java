package com.example.besideCoding.contest.model;

import com.example.besideCoding.problem.model.Problems;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "contest_problem")
@Data
public class ContestProblem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "contest_id", nullable = false)

    private Contest contest;

    @ManyToOne
    @JoinColumn(name = "problem_id", nullable = false)

    private Problems problem;

    // Optional: Add order or points if needed
    // private Integer problemOrder;
    // private Integer points;
}
