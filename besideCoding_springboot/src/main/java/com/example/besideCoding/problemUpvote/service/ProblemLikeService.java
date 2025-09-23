package com.example.besideCoding.problemUpvote.service;

import com.example.besideCoding.problemUpvote.model.ProblemLike;
import com.example.besideCoding.problemUpvote.repository.ProblemLikeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@RequiredArgsConstructor
public class ProblemLikeService {

    private final ProblemLikeRepository repository;

    public Map<String, Object> getInteractionData(Long problemId, Long userId) {
        int likes = repository.countLikes(problemId);
        int dislikes = repository.countDislikes(problemId);

        Map<String, Object> result = new HashMap<>();
        result.put("likes", likes);
        result.put("dislikes", dislikes);

        if (userId != null) {
            Optional<ProblemLike> existing = repository.findByUserIdAndProblemId(userId, problemId);
            result.put("userStatus", existing.map(e -> e.getStatus().name()).orElse(null));
        } else {
            result.put("userStatus", null); // Not logged in
        }

        return result;
    }


    @Transactional
    public Map<String, Object> toggleInteraction(Long problemId, Long userId, String newStatus) {
        Optional<ProblemLike> existingOpt = repository.findByUserIdAndProblemId(userId, problemId);

        if (existingOpt.isPresent()) {
            ProblemLike existing = existingOpt.get();
            if (newStatus == null) {
                repository.delete(existing); // remove like/dislike
            } else if (!existing.getStatus().name().equals(newStatus)) {
                existing.setStatus(ProblemLike.Status.valueOf(newStatus));
                repository.save(existing);
            } else {
                repository.delete(existing); // toggle off
            }
        } else {
            if (newStatus != null) {
                repository.save(new ProblemLike(null, userId, problemId, ProblemLike.Status.valueOf(newStatus)));
            }
        }

        return getInteractionData(problemId, userId);
    }
}
