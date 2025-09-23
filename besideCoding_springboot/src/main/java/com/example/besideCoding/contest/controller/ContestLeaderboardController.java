package com.example.besideCoding.contest.controller;

import com.example.besideCoding.contest.dto.ContestLeaderboardDTO;
import com.example.besideCoding.contest.service.ContestLeaderboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contests")
public class ContestLeaderboardController {

    @Autowired
    private ContestLeaderboardService service;

    @GetMapping("/{contestId}/leaderboard")
    public List<ContestLeaderboardDTO> getLeaderboard(@PathVariable Integer contestId) {
        return service.getLeaderboard(contestId);
    }
}
