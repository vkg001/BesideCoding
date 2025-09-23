package com.example.besideCoding.submission.dto;

import lombok.Data;

@Data
public class SubmissionRequestDTO {
    private int userId;
    private int problemId;
    private String answer;
}
