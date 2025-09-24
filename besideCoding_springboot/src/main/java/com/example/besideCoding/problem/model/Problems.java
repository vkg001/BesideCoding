package com.example.besideCoding.problem.model;

import com.example.besideCoding.contest.model.ContestProblem;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor; // Good practice to add
import lombok.AllArgsConstructor; // Good practice to add

import java.sql.Timestamp;
import java.util.List;

@Entity
@Table(name = "problems")
@Data
@NoArgsConstructor // Lombok annotation for no-args constructor
@AllArgsConstructor // Lombok annotation for all-args constructor
public class Problems {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "problem_type")
    private ProblemType problemType;

    @Column(name = "additional_info", columnDefinition = "TEXT")
    private String additionalInfo;

    @Column(columnDefinition = "TEXT")
    private String solution;

    private String company; // Used for filtering
    private String difficulty;

    private String category; // Used for filtering
    private String subCategory; // Used for filtering

    private int likes = 0;
    private int dislikes = 0;
    private int views = 0;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private Status status = Status.Need_Approval;

    private int reports = 0;

    @Column(name = "created_at", updatable = false, insertable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private Timestamp createdAt;

    public enum ProblemType {
        Integer, MCQ
    }

    public enum Status {
        Live, Hold, Need_Approval, Edit_Required
    }

    @OneToMany(mappedBy = "problem")
    private List<ContestProblem> usedInContests;

}