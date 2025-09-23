// ProblemResponseDTO.java
package com.example.besideCoding.problem.dto;

import com.example.besideCoding.problem.model.Problem;
import lombok.Data;

@Data
public class ProblemResponseDTO {
    private int id;
    private String title;
    private String description;
    private String problemType;
    private String additionalInfo;
    private String solution;
    private String company;
    private String difficulty;
    private String category;
    private String subCategory;
    private int likes;
    private int dislikes;
    private int views;

    public static ProblemResponseDTO fromEntity(Problem problem) {
        ProblemResponseDTO dto = new ProblemResponseDTO();
        dto.setId(problem.getId());
        dto.setTitle(problem.getTitle());
        dto.setDescription(problem.getDescription());
        dto.setProblemType(problem.getProblemType().name());
        dto.setAdditionalInfo(problem.getAdditionalInfo());
        dto.setSolution(problem.getSolution());
        dto.setCompany(problem.getCompany());
        dto.setDifficulty(problem.getDifficulty());
        dto.setCategory(problem.getCategory());
        dto.setSubCategory(problem.getSubCategory());
        dto.setLikes(problem.getLikes());
        dto.setDislikes(problem.getDislikes());
        dto.setViews(problem.getViews());
        return dto;
    }
}
