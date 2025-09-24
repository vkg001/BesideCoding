package com.example.besideCoding.dashboard.service;

import com.example.besideCoding.contest.model.Contest;
import com.example.besideCoding.contest.repository.ContestRepository;
import com.example.besideCoding.dashboard.dto.DashboardStatsDTO;
import com.example.besideCoding.problem.repository.ProblemRepository;
import com.example.besideCoding.problem.service.ProblemService;
import com.example.besideCoding.signup.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final UserRepository userRepository;
    private final ProblemRepository problemRepository;
    private final ContestRepository contestRepository;
    private final ProblemService problemService;



    public DashboardStatsDTO getDashboardStats() {
        long totalUsers = userRepository.count();
        long totalProblems = problemRepository.count();
        long totalContests = contestRepository.count();
        long totalSubmissions = 321;

        Map<String, Long> problemCounts = problemService.getProblemCountsByDifficulty();
        DashboardStatsDTO.ContestCounts contestCounts = calculateContestCounts();

        return DashboardStatsDTO.builder()
                .totalUsers(totalUsers)
                .totalProblems(totalProblems)
                .totalContests(totalContests)
                .totalSubmissions(totalSubmissions)
                .problemCountsByDifficulty(problemCounts)
                .contestCounts(contestCounts)
                .build();
    }

    private DashboardStatsDTO.ContestCounts calculateContestCounts() {
        List<Contest> allContests = contestRepository.findAll();
        Instant now = Instant.now();
        long upcoming = 0;
        long active = 0;
        long past = 0;

        for (Contest contest : allContests) {
            Instant startTime = contest.getStartTime().toInstant(ZoneOffset.UTC);
            Instant endTime = contest.getEndTime().toInstant(ZoneOffset.UTC);

            if (now.isBefore(startTime)) {
                upcoming++;
            } else if (now.isAfter(endTime)) {
                past++;
            } else {
                active++;
            }
        }

        return DashboardStatsDTO.ContestCounts.builder()
                .upcoming(upcoming)
                .active(active)
                .past(past)
                .build();
    }
}