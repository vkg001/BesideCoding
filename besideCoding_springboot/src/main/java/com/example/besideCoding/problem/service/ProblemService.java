package com.example.besideCoding.problem.service;

import com.example.besideCoding.problem.dto.ProblemContributionRequestDTO;
import com.example.besideCoding.problem.model.Problems;
import com.example.besideCoding.problem.repository.ProblemRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ProblemService {

    private final ProblemRepository problemRepository;

    @Autowired
    public ProblemService(ProblemRepository problemRepository) {
        this.problemRepository = problemRepository;
    }

    public List<Problems> getProblems(String category, List<String> subCategories, List<String> companies, String searchTerm) {
        String effectiveCategory = normalizeSingleParam(category, "All Problems");
        String effectiveSearchTerm = StringUtils.hasText(searchTerm) ? searchTerm.trim() : null;

        // For list parameters, pass null if the list is null or empty, otherwise pass the list.
        // The JPQL query (:paramList IS NULL OR field IN :paramList) handles null lists correctly.
        List<String> effectiveSubCategories = (subCategories != null && !subCategories.isEmpty()) ? subCategories : null;
        List<String> effectiveCompanies = (companies != null && !companies.isEmpty()) ? companies : null;

        return problemRepository.findProblemsByMultipleFilters(
                effectiveCategory,
                effectiveSubCategories,
                effectiveCompanies,
                effectiveSearchTerm
        );
    }

    // Renamed for clarity as it's for single string parameters
    private String normalizeSingleParam(String paramValue, String allIdentifierValue) {
        if (StringUtils.hasText(paramValue) && !paramValue.equalsIgnoreCase(allIdentifierValue)) {
            return paramValue.trim();
        }
        return null;
    }

    public Problems getProblemById(int id) {
        return problemRepository.findById(id)
                .orElse(null); // Consider throwing a custom NotFoundException
    }

    public List<String> getAllSubCategories() {
        List<String> subCategories = problemRepository.findAllDistinctSubCategories();
        return subCategories != null ? subCategories : Collections.emptyList();
    }

    public List<String> getAllCompanies() {
        List<String> companies = problemRepository.findAllDistinctCompanies();
        return companies != null ? companies : Collections.emptyList();
    }

    public Map<String, Long> getProblemCountsByDifficulty() {
        List<Object[]> results = problemRepository.countProblemsByDifficulty();

        // Convert the list of Object[] to a Map<String, Long>
        return results.stream()
                .collect(Collectors.toMap(
                        // The first element (index 0) is the difficulty (String)
                        resultArray -> StringUtils.capitalize((String) resultArray[0]),
                        // The second element (index 1) is the count (Long)
                        resultArray -> (Long) resultArray[1]
                ));
    }

    // If findAdditionalInfoByProblemId is needed:
    // public String getAdditionalInfoForProblem(int id) {
    //     return problemRepository.findAdditionalInfoByProblemId(id);
    // }

    public void contributeProblem(ProblemContributionRequestDTO dto) {
        try {
            Problems problem = new Problems();
            problem.setTitle(dto.getTitle());
            problem.setDescription(dto.getDescription());
            problem.setProblemType(Problems.ProblemType.valueOf(dto.getProblemType()));
            problem.setSolution(dto.getSolution());
            problem.setCategory(dto.getCategory());
            problem.setDifficulty(dto.getDifficulty());
            problem.setSubCategory(dto.getSubCategory());
            problem.setCompany(dto.getCompany());
            problem.setStatus(Problems.Status.Need_Approval); // always need approval
            problem.setLikes(0);
            problem.setDislikes(0);
            problem.setViews(0);
            problem.setReports(0);

            // Build additionalInfo JSON
            ObjectMapper mapper = new ObjectMapper();
            if ("MCQ".equalsIgnoreCase(dto.getProblemType())) {
                problem.setAdditionalInfo(
                        mapper.writeValueAsString(Map.of(
                                "options", dto.getOptions(),
                                "answer", dto.getAnswer()
                        ))
                );
            } else {
                problem.setAdditionalInfo(
                        mapper.writeValueAsString(Map.of(
                                "answer", dto.getAnswer()
                        ))
                );
            }

            problemRepository.save(problem);
        } catch (Exception e) {
            throw new RuntimeException("Failed to contribute problem: " + e.getMessage());
        }
    }
}