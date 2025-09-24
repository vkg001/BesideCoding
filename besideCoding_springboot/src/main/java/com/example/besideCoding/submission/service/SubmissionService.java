package com.example.besideCoding.submission.service;

import com.example.besideCoding.problem.model.Problems; // Ensure this import is present
import com.example.besideCoding.problem.repository.ProblemRepository;
import com.example.besideCoding.submission.dto.SubmissionRequestDTO;
import com.example.besideCoding.submission.model.ProblemSubmitted;
import com.example.besideCoding.submission.repository.SubmissionRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils; // For StringUtils.hasText

import java.time.LocalDateTime;
import java.util.Optional; // For handling optional results

@Service
public class SubmissionService {

    @Autowired
    private SubmissionRepository submissionRepository;

    @Autowired
    private ProblemRepository problemRepository; // This should already be here

    private final ObjectMapper mapper = new ObjectMapper();

    public String submitAnswer(SubmissionRequestDTO request) throws Exception {
        // Fetch the whole Problem entity
        Optional<Problems> problemOptional = problemRepository.findById(request.getProblemId());

        if (!problemOptional.isPresent()) {
            // Or throw a custom exception like ProblemNotFoundException
            throw new RuntimeException("Problem not found with ID: " + request.getProblemId());
        }

        Problems problem = problemOptional.get();
        String infoJson = problem.getAdditionalInfo(); // Get the additional_info field

        if (!StringUtils.hasText(infoJson)) {
            // Handle cases where additional_info might be null or empty
            // This might mean the problem setup is incomplete.
            // You could return "error", throw an exception, or assume it's "unsolved".
            // For now, let's treat it as an issue with problem data.
            System.err.println("Warning: Additional info (containing answer) is missing or empty for problem ID: " + request.getProblemId());
            // Depending on requirements, you might want to log this and still mark as unsolved or throw an error.
            // For this example, let's assume if no answer data, it can't be solved.
            ProblemSubmitted errorSubmission = new ProblemSubmitted();
            errorSubmission.setUserId(request.getUserId());
            errorSubmission.setProblemId(request.getProblemId());
            errorSubmission.setSubmittedTime(LocalDateTime.now());
            errorSubmission.setSubmittedStatus("error_no_answer_data"); // Or some other status
            submissionRepository.save(errorSubmission);
            throw new RuntimeException("Problem data is incomplete (missing answer). Cannot process submission for problem ID: " + request.getProblemId());
        }

        JsonNode info = mapper.readTree(infoJson);
        JsonNode answerNode = info.get("answer");

        if (answerNode == null || answerNode.isNull() || !answerNode.isTextual()) {
            System.err.println("Warning: 'answer' field is missing, null, or not text in additional_info for problem ID: " + request.getProblemId());
            // Handle this similar to missing infoJson
            ProblemSubmitted errorSubmission = new ProblemSubmitted();
            errorSubmission.setUserId(request.getUserId());
            errorSubmission.setProblemId(request.getProblemId());
            errorSubmission.setSubmittedTime(LocalDateTime.now());
            errorSubmission.setSubmittedStatus("error_invalid_answer_format");
            submissionRepository.save(errorSubmission);
            throw new RuntimeException("Problem answer data is invalid for problem ID: " + request.getProblemId());
        }

        String correctAnswer = answerNode.asText();

        boolean isCorrect = correctAnswer.trim().equalsIgnoreCase(request.getAnswer().trim());

        ProblemSubmitted submitted = new ProblemSubmitted();
        submitted.setUserId(request.getUserId());
        submitted.setProblemId(request.getProblemId());
        submitted.setSubmittedTime(LocalDateTime.now());
        submitted.setSubmittedStatus(isCorrect ? "solved" : "unsolved");

        submissionRepository.save(submitted);

        return isCorrect ? "solved" : "unsolved";
    }
}