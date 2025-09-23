package com.example.besideCoding.contest.service;

import com.example.besideCoding.contest.dto.ContestLeaderboardDTO;
import com.example.besideCoding.contest.model.Contest;
import com.example.besideCoding.contest.repository.ContestRepository;
import com.example.besideCoding.contestsubmission.repository.ContestSubmissionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Time;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ContestLeaderboardService {

    @Autowired
    private ContestSubmissionRepository submissionRepository;

    @Autowired
    private ContestRepository contestRepository;

    public List<ContestLeaderboardDTO> getLeaderboard(Integer contestId) {
        // Step 1: Get total problems for this contest using the CORRECT method name
        Optional<Contest> contestOpt = contestRepository.findById(contestId);

        // vvv --- THE ONLY CHANGE IS ON THIS LINE --- vvv
        int totalProblemsInContest = contestOpt.map(c -> c.getContestProblems().size()).orElse(0);
        // ^^^ --- THE ONLY CHANGE IS ON THIS LINE --- ^^^

        // Step 2: Get leaderboard data using the submission repository
        List<Object[]> rows = submissionRepository.getLeaderboardByContestId(contestId);
        List<ContestLeaderboardDTO> result = new ArrayList<>();

        // Step 3: Map the raw SQL result to our DTO
        int rank = 1;
        for (Object[] row : rows) {
            String name = (String) row[0];
            int correct = ((Number) row[1]).intValue();
            int score = ((Number) row[3]).intValue();
            String finishTime = formatTime(row[4]);

            // Use the total problems from Step 1 for the 'total' field
            result.add(new ContestLeaderboardDTO(rank++, name, correct, totalProblemsInContest, score, finishTime));
        }

        return result;
    }

    private String formatTime(Object timeObj) {
        if (timeObj == null) return "00:00:00";
        if (timeObj instanceof Time) return ((Time) timeObj).toLocalTime().toString();
        return timeObj.toString();
    }
}