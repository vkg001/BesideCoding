package com.example.besideCoding.discussion.dto;

import lombok.Data;

@Data
public class DiscussionFilterRequestDTO {
    private String type;  // "Question", "Article", etc.
    private String sort;  // "newest", "mostLiked"
}
