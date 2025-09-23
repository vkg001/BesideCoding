package com.example.besideCoding.contestsubmission.controller;

import com.example.besideCoding.contestsubmission.dto.ContestSubmissionRequest;
import com.example.besideCoding.contestsubmission.service.ContestSubmissionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ContestSubmissionController {

    private final ContestSubmissionService submissionService;

    @PostMapping("/submit-contest")
    public ResponseEntity<?> submitContestAnswer(@RequestBody ContestSubmissionRequest request) {
        submissionService.submitAnswer(request);
        return ResponseEntity.ok("Submission recorded");
    }
}
