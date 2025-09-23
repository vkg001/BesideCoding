package com.example.besideCoding.problemUpvote.controller;

import com.example.besideCoding.problemUpvote.service.ProblemLikeService;
import lombok.*;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/problems")
@RequiredArgsConstructor
public class ProblemLikeController {

    private final ProblemLikeService service;

    @GetMapping("/{problemId}/interactions")
    public ResponseEntity<Map<String, Object>> getInteractions(
            @PathVariable Long problemId,
            @RequestParam(required = false) Long userId) {
        return ResponseEntity.ok(service.getInteractionData(problemId, userId));
    }

    @PostMapping("/{problemId}/interact")
    public ResponseEntity<Map<String, Object>> interact(
            @PathVariable Long problemId,
            @RequestBody InteractionRequest request) {
        return ResponseEntity.ok(service.toggleInteraction(problemId, request.userId, request.status));
    }

    @Data
    public static class InteractionRequest {
        public Long userId;
        public String status; // "LIKE", "DISLIKE", or null to remove
    }
}

