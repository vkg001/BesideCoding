package com.example.besideCoding.submission.controller;

import com.example.besideCoding.submission.dto.SubmissionRequestDTO;
import com.example.besideCoding.submission.service.SubmissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin("http://localhost:5173")
public class SubmissionController {

    @Autowired
    private SubmissionService submissionService;

    @PostMapping("/submit")
    public ResponseEntity<?> submitAnswer(@RequestBody SubmissionRequestDTO request) {
        try {
            String status = submissionService.submitAnswer(request);
            return ResponseEntity.ok().body(Map.of("status", status));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
