package com.example.besideCoding.discussion.dto;

import lombok.Data;

@Data
public class DiscussionRequestDTO {
    private Integer userId;
    private String title;
    private String description;
    private String type; // Must be one of the allowed types
}
