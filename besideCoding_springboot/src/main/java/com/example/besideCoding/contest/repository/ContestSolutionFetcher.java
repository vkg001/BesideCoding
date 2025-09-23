package com.example.besideCoding.contest.repository;

import com.example.besideCoding.contest.dto.ContestSolutionDTO;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.cloudinary.json.JSONObject;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
public class ContestSolutionFetcher {

    @PersistenceContext
    private EntityManager em;

    public List<ContestSolutionDTO> getUserSolutionsForContest(Integer contestId, Integer userId) {
        // --- FINAL, CORRECTED SQL QUERY ---
        // The LEFT JOIN now includes a condition for `contest_id` to prevent
        // submissions from other contests from appearing.
        String sql = """
            SELECT
                p.id as problem_id,
                cs.answer,
                p.title, p.description, p.problem_type, p.additional_info,
                p.solution, p.company, p.difficulty, p.category, p.sub_category,
                p.likes, p.dislikes, p.views
            FROM
                contest_problem cp
            JOIN
                problems p ON cp.problem_id = p.id
            LEFT JOIN
                contest_submissions cs ON p.id = cs.problem_id
                                       AND cs.user_id = :userId
                                       AND cs.contest_id = :contestId  -- <-- THE CRITICAL FIX IS HERE
            WHERE
                cp.contest_id = :contestId
            ORDER BY
                p.id ASC -- Assuming you have an ordering column like 'problem_order'
        """;

        List<Object[]> results = em.createNativeQuery(sql)
                .setParameter("contestId", contestId)
                .setParameter("userId", userId)
                .getResultList();

        List<ContestSolutionDTO> list = new ArrayList<>();

        for (Object[] row : results) {
            ContestSolutionDTO dto = new ContestSolutionDTO();
            dto.setId(((Number) row[0]).intValue());
            dto.setUserAnswer((String) row[1]);
            dto.setTitle((String) row[2]);
            dto.setDescription((String) row[3]);
            dto.setProblemType((String) row[4]);

            String additionalInfo = (String) row[5];
            dto.setAdditionalInfo(additionalInfo);

            String correctAnswer = null;
            if (additionalInfo != null) {
                try {
                    JSONObject obj = new JSONObject(additionalInfo);
                    correctAnswer = obj.optString("answer", null);
                } catch (Exception e) {
                    System.err.println("Error parsing additional_info JSON for problem ID " + dto.getId() + ": " + e.getMessage());
                    correctAnswer = null;
                }
            }
            dto.setCorrectAnswer(correctAnswer);

            dto.setSolution((String) row[6]);
            dto.setCompany((String) row[7]);
            dto.setDifficulty((String) row[8]);
            dto.setCategory((String) row[9]);
            dto.setSubCategory((String) row[10]);
            dto.setLikes(row[11] != null ? ((Number) row[11]).intValue() : 0);
            dto.setDislikes(row[12] != null ? ((Number) row[12]).intValue() : 0);
            dto.setViews(row[13] != null ? ((Number) row[13]).intValue() : 0);

            list.add(dto);
        }

        return list;
    }
}