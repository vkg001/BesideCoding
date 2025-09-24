package com.example.besideCoding.dashboard.dto;

import lombok.Builder;
import lombok.Data;
import java.util.Map;

@Data
@Builder
public class DashboardStatsDTO {
    private long totalUsers;
    private long totalProblems;
    private long totalContests;
    private long totalSubmissions;
    private Map<String, Long> problemCountsByDifficulty;
    private ContestCounts contestCounts;

    @Data
    @Builder
    public static class ContestCounts {
        private long upcoming;
        private long active;
        private long past;
    }
}