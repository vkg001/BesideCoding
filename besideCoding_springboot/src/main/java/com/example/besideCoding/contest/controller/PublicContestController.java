package com.example.besideCoding.contest.controller;

import com.example.besideCoding.contest.dto.ContestProblemDTO;
import com.example.besideCoding.contest.dto.ContestResponseDTO;
import com.example.besideCoding.contest.dto.ContestSolutionDTO;
import com.example.besideCoding.contest.service.ContestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contests")
public class PublicContestController {

    @Autowired
    private ContestService contestService;

    @GetMapping("/upcoming")
    public ResponseEntity<List<ContestResponseDTO>> getUpcomingContests() {
        return ResponseEntity.ok(contestService.getUpcomingContests());
    }

    @GetMapping("/active")
    public ResponseEntity<List<ContestResponseDTO>> getActiveContests() {
        return ResponseEntity.ok(contestService.getActiveContests());
    }

    @GetMapping("/past")
    public ResponseEntity<List<ContestResponseDTO>> getPastContests() {
        return ResponseEntity.ok(contestService.getPastContests());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ContestResponseDTO> getContestById(@PathVariable("id") Integer id) {
        return ResponseEntity.ok(contestService.getContestById(id));
    }

    @GetMapping("/{contestId}/problems")
    public ResponseEntity<List<ContestProblemDTO>> getContestProblems(@PathVariable Integer contestId) {
        List<ContestProblemDTO> problems = contestService.getContestProblems(contestId);
        return ResponseEntity.ok(problems);
    }

    @GetMapping("/{contestId}/problem/{index}")
    public ContestProblemDTO getProblemByIndex(@PathVariable Integer contestId, @PathVariable int index) {
        return contestService.getProblemByIndex(contestId, index);
    }

    @GetMapping("/{contestId}/submissions")
    public List<ContestSolutionDTO> getUserSubmissionsForContest(
            @PathVariable Integer contestId,
            @RequestParam Integer userId // 👈 Get userId from frontend query param
    ) {
        return contestService.getUserSolutions(contestId, userId);
    }


}
