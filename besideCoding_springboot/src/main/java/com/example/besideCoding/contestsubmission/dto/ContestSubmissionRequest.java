package com.example.besideCoding.contestsubmission.dto;

import lombok.Data;

@Data
public class ContestSubmissionRequest {
    private int userId;
    private int contestId;
    private int problemId;
    private String answer;
}
