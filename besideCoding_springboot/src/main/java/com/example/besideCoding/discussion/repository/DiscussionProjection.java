package com.example.besideCoding.discussion.repository;

import java.time.LocalDateTime;

public interface DiscussionProjection {
    Integer getDiscussionId();
    Integer getUserId();
    String getTitle();
    String getDescription();
    Integer getLikes();
    Integer getDislikes();
    Integer getViews();
    String getType();
    java.sql.Timestamp getCreatedAt();
    String getUsername(); // matches alias `AS username`
}
