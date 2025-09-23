package com.example.besideCoding.contest.dto;

import com.example.besideCoding.contest.model.Contest;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ContestResponseDTO {
    private Integer id;
    private String title;
    private String description;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private boolean visible;
    private LocalDateTime createdAt;
    private int participantCount;


}
