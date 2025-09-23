package com.example.besideCoding.problem.dto;

import lombok.Data;

import java.util.List;

@Data
public class ProblemContributionRequestDTO {
    private String title;
    private String description;
    private String problemType; // "Integer" or "MCQ"
    private List<String> options; // for MCQ only
    private String answer;
    private String solution;
    private String category;
    private String difficulty;
    private String subCategory;
    private String company;
}
