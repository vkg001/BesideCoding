package com.example.besideCoding.contestsubmission.service;


import com.example.besideCoding.contestsubmission.dto.ContestSubmissionRequest;
import com.example.besideCoding.contestsubmission.repository.ContestSubmissionRepository;
import com.example.besideCoding.problem.model.Problems;
import com.example.besideCoding.problem.repository.ProblemRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
public class ContestSubmissionService {

    private final ContestSubmissionRepository submissionRepository;
    private final ProblemRepository problemRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Transactional
    public void submitAnswer(ContestSubmissionRequest req) {
        Problems problem = problemRepository.findById(req.getProblemId())
                .orElseThrow(() -> new RuntimeException("Problem not found"));

        String additionalInfoJson = problem.getAdditionalInfo();

        if (!StringUtils.hasText(additionalInfoJson)) {
            throw new RuntimeException("Missing additional_info for problem ID: " + req.getProblemId());
        }

        String correctAnswer;
        try {
            JsonNode info = objectMapper.readTree(additionalInfoJson);
            JsonNode answerNode = info.get("answer");

            if (answerNode == null || !answerNode.isTextual()) {
                throw new RuntimeException("Invalid or missing 'answer' field in additional_info");
            }

            correctAnswer = answerNode.asText();
        } catch (Exception e) {
            throw new RuntimeException("Error parsing additional_info JSON", e);
        }

        boolean isCorrect = correctAnswer.trim().equalsIgnoreCase(req.getAnswer().trim());

        submissionRepository.upsertSubmission(
                req.getUserId(),
                req.getContestId(),
                req.getProblemId(),
                req.getAnswer(),
                isCorrect
        );
    }
}