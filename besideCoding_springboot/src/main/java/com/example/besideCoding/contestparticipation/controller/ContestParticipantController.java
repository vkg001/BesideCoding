package com.example.besideCoding.contestparticipation.controller;

import com.example.besideCoding.contest.model.Contest;
import com.example.besideCoding.contest.repository.ContestRepository;
import com.example.besideCoding.contestparticipation.service.ContestParticipantService;
import com.example.besideCoding.signup.model.Users;
import com.example.besideCoding.signup.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/contest-participant")
@RequiredArgsConstructor
public class ContestParticipantController {

    private final ContestParticipantService service;
    private final UserRepository userRepo;
    private final ContestRepository contestRepo;

    @PostMapping("/join")
    public ResponseEntity<?> joinContest(@RequestParam Integer userId, @RequestParam Integer contestId) {
        Optional<Users> user = userRepo.findById(userId);
        Optional<Contest> contest = contestRepo.findById(contestId);

        if (user.isEmpty() || contest.isEmpty()) {
            return ResponseEntity.badRequest().body("Invalid user or contest ID");
        }

        boolean hasEnded = service.hasUserEndedContest(user.get(), contest.get());
        if (hasEnded) {
            return ResponseEntity.status(403).body("User already ended this contest");
        }

        service.markUserJoined(user.get(), contest.get());
        return ResponseEntity.ok("User joined contest");
    }

    @PostMapping("/end")
    public ResponseEntity<?> endContest(@RequestParam Integer userId, @RequestParam Integer contestId) {
        Optional<Users> user = userRepo.findById(userId);
        Optional<Contest> contest = contestRepo.findById(contestId);

        if (user.isEmpty() || contest.isEmpty()) {
            return ResponseEntity.badRequest().body("Invalid user or contest ID");
        }

        boolean wasUpdated = service.markUserEnded(user.get(), contest.get());

        if (wasUpdated) {
            return ResponseEntity.ok("User contest participation marked as ended");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Participation record not found for this user and contest.");
        }
    }

    @GetMapping("/status")
    public ResponseEntity<?> getParticipationStatus(@RequestParam Long userId, @RequestParam Long contestId) {
        Optional<Users> userOpt = userRepo.findById(userId.intValue()); // Adjust if your repo takes Long
        Optional<Contest> contestOpt = contestRepo.findById(contestId.intValue()); // Adjust if your repo takes Long

        if (userOpt.isEmpty() || contestOpt.isEmpty()) {
            // Return false if user/contest doesn't exist, as they can't have ended it
            return ResponseEntity.ok(Map.of("hasEnded", false));
        }

        boolean hasEnded = service.hasUserEndedContest(userOpt.get(), contestOpt.get());
        return ResponseEntity.ok(Map.of("hasEnded", hasEnded));
    }
}
