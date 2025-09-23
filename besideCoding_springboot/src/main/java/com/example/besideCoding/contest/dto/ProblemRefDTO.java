package com.example.besideCoding.contest.dto;

import lombok.Data;

@Data
public class ProblemRefDTO {
    private Integer id; // Existing problem ID (null if new)
    private String title;
    private String description;
}
