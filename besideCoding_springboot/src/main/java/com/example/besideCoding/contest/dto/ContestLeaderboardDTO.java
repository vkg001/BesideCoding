package com.example.besideCoding.contest.dto;

import lombok.Data;

@Data
public class ContestLeaderboardDTO {
    private int rank;
    private String name;
    private int correct;
    private int total;
    private int score;
    private String finishTime;

    public ContestLeaderboardDTO(int rank, String name, int correct, int total, int score, String finishTime) {
        this.rank = rank;
        this.name = name;
        this.correct = correct;
        this.total = total;
        this.score = score;
        this.finishTime = finishTime;
    }
}
