package com.example.besideCoding.contest.service;

import com.example.besideCoding.contest.dto.*;
import com.example.besideCoding.contest.model.Contest;
import com.example.besideCoding.contest.model.ContestProblem;
import com.example.besideCoding.contest.repository.ContestProblemRepository;
import com.example.besideCoding.contest.repository.ContestRepository;
import com.example.besideCoding.contest.repository.ContestSolutionFetcher;
import com.example.besideCoding.contestparticipation.service.ContestParticipantService;
import com.example.besideCoding.problem.model.Problems;
import com.example.besideCoding.problem.repository.ProblemRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class ContestService {

    private final ContestRepository contestRepository;
    private final ProblemRepository problemRepository;
    private final ContestProblemRepository contestProblemRepository;
    private final ContestParticipantService contestParticipantService;
    private final ContestSolutionFetcher contestSolutionFetcher;

    @Transactional
    public void createContest(ContestCreateRequestDTO dto) {
        Contest contest = new Contest();
        contest.setTitle(dto.getTitle());
        contest.setDescription(dto.getDescription());
        contest.setStartTime(dto.getStartTime());
        contest.setEndTime(dto.getEndTime());
        contest.setVisible(dto.isVisible()); // ✅ FIX: Use the value from the DTO
        contestRepository.save(contest);

        // ✅ FIX: Add null check to prevent NullPointerException
        if (dto.getProblems() != null) {
            for (ProblemRefDTO ref : dto.getProblems()) {
                Problems problem;

                if (ref.getId() != null) {
                    problem = problemRepository.findById(ref.getId())
                            .orElseThrow(() -> new RuntimeException("Problem not found: " + ref.getId()));
                } else {
                    Problems newProblem = new Problems();
                    newProblem.setTitle(ref.getTitle());
                    newProblem.setDescription(ref.getDescription());
                    // Set sensible defaults for new problems
                    newProblem.setStatus(Problems.Status.Need_Approval);
                    newProblem.setLikes(0);
                    newProblem.setDislikes(0);
                    newProblem.setViews(0);
                    newProblem.setReports(0);
                    problem = problemRepository.save(newProblem);
                }

                ContestProblem cp = new ContestProblem();
                cp.setContest(contest);
                cp.setProblem(problem);
                contestProblemRepository.save(cp);
            }
        }
    }

    private ContestResponseDTO toDto(Contest contest) {
        int count = contestParticipantService.countUsersByContest(contest);

        ContestResponseDTO dto = new ContestResponseDTO();
        dto.setId(contest.getId());
        dto.setTitle(contest.getTitle());
        dto.setDescription(contest.getDescription());
        dto.setStartTime(contest.getStartTime());
        dto.setEndTime(contest.getEndTime());
        dto.setVisible(contest.isVisible());
        dto.setCreatedAt(contest.getCreatedAt());
        dto.setParticipantCount(count);
        return dto;
    }


    public List<ContestResponseDTO> getAllContests() {
        return contestRepository.findAll().stream()
                .map(this::toDto)
                .toList();
    }

    public List<ContestResponseDTO> getUpcomingContests() {
        return contestRepository.findByStartTimeAfter(LocalDateTime.now()).stream()
                .map(this::toDto)
                .toList();
    }

    public List<ContestResponseDTO> getActiveContests() {
        LocalDateTime now = LocalDateTime.now();
        return contestRepository.findByStartTimeBeforeAndEndTimeAfter(now, now).stream()
                .map(this::toDto)
                .toList();
    }

    public List<ContestResponseDTO> getPastContests() {
        return contestRepository.findByEndTimeBefore(LocalDateTime.now()).stream()
                .map(this::toDto)
                .toList();
    }

    public ContestResponseDTO getContestById(Integer id) {
        Contest contest = contestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Contest not found with id: " + id));
        return toDto(contest);
    }

    public List<ContestProblemDTO> getContestProblems(Integer contestId) {
        Contest contest = contestRepository.findById(contestId)
                .orElseThrow(() -> new RuntimeException("Contest not found with id: " + contestId));

        ObjectMapper mapper = new ObjectMapper();

        return contest.getContestProblems().stream().map(cp -> {
            Problems p = cp.getProblem();
            List<String> options = null;
            String problemType = p.getProblemType() != null ? p.getProblemType().name() : null;


            if (p.getAdditionalInfo() != null && !p.getAdditionalInfo().isBlank()) {
                try {
                    JsonNode additionalInfo = mapper.readTree(p.getAdditionalInfo());
                    if (additionalInfo.has("options")) {
                        options = mapper.convertValue(additionalInfo.get("options"), List.class);
                    }
                } catch (Exception e) {
                    throw new RuntimeException("Failed to parse options from additionalInfo", e);
                }
            }
            return new ContestProblemDTO(p.getId(), p.getTitle(), p.getDescription(), options, problemType);
        }).toList();
    }

    public ContestProblemDTO getProblemByIndex(Integer contestId, int index) {
        Contest contest = contestRepository.findById(contestId)
                .orElseThrow(() -> new RuntimeException("Contest not found with id: " + contestId));

        if (index < 0 || index >= contest.getContestProblems().size()) {
            throw new RuntimeException("Invalid problem index: " + index);
        }

        ContestProblem contestProblem = contest.getContestProblems().get(index);
        Problems p = contestProblem.getProblem();

        List<String> options = null;
        String problemType = p.getProblemType() != null ? p.getProblemType().name() : null;

        if (p.getAdditionalInfo() != null && !p.getAdditionalInfo().isBlank()) {
            try {
                ObjectMapper mapper = new ObjectMapper();
                JsonNode additionalInfo = mapper.readTree(p.getAdditionalInfo());
                if (additionalInfo.has("options")) {
                    options = mapper.convertValue(additionalInfo.get("options"), List.class);
                }
            } catch (Exception e) {
                throw new RuntimeException("Failed to parse additionalInfo for problem ID " + p.getId(), e);
            }
        }
        return new ContestProblemDTO(p.getId(), p.getTitle(), p.getDescription(), options, problemType);
    }

    public List<ContestSolutionDTO> getUserSolutions(Integer contestId, Integer userId) {
        return contestSolutionFetcher.getUserSolutionsForContest(contestId, userId);
    }
}