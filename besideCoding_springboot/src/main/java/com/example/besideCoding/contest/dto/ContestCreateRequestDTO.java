package com.example.besideCoding.contest.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class ContestCreateRequestDTO {
    private String title;
    private String description;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private boolean visible;
    private List<ProblemRefDTO> problems;
}
