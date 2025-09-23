package com.example.besideCoding.contest.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ContestSolutionDTO {
    private int id;
    private String title;
    private String description;
    private String problemType;
    private String additionalInfo;
    private String solution;
    private String company;
    private String difficulty;
    private String category;
    private String subCategory;
    private int likes;
    private int dislikes;
    private int views;

    // Additional fields for contest solution view
    private String userAnswer;
    private String correctAnswer;
}
