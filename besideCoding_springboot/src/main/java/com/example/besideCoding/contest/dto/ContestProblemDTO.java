package com.example.besideCoding.contest.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class ContestProblemDTO {
    private Integer id;
    private String title;
    private String description;
    private List<String> options; // For MCQ type problems
    private String problemType;
}
