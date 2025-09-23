// src/main/java/com/example/besideCoding/profile/dto/ProfileResponseDTO.java
package com.example.besideCoding.profile.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import java.time.LocalDateTime; // Use LocalDateTime
import java.util.List;
import java.util.Map;

@Data
public class ProfileResponseDTO {
    private String name;
    private String college_or_company;
    private String profile_pic;
    private int totalSubmissions;
    private int totalSolved; // optional if you implement
    private Map<String, Integer> submissionsByCategory;
    private Map<String, Integer> submissionsByTopic;
    private Map<String, Integer> acceptedByDifficulty;
    private List<RecentSubmissionDTO> recentSubmissions;

    @Data
    public static class RecentSubmissionDTO {
        private String title;
        // Use LocalDateTime. Jackson will serialize to ISO 8601 string by default.
        // Add @JsonFormat if you need a specific output string format.
        // e.g., @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
        private LocalDateTime submittedAt;
        private Long problemId;
    }

    private int contestsParticipated;
}