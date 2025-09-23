package com.example.besideCoding.discussion.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class DiscussionResponseDTO {
    private Integer id;
    private String title;
    private String description;
    private String type;
    private int likes;
    private int dislikes;
    private int views;
    private LocalDateTime createdAt;
    private String userName;
}
