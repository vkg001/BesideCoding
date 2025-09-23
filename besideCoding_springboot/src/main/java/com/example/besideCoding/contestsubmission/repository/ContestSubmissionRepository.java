package com.example.besideCoding.contestsubmission.repository;

import com.example.besideCoding.contestsubmission.model.ContestSubmission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ContestSubmissionRepository extends JpaRepository<ContestSubmission,Integer> {

    @Modifying
    @Query(value = """
    INSERT INTO contest_submissions (user_id, contest_id, problem_id, answer, is_correct, submitted_at)
    VALUES (:userId, :contestId, :problemId, :answer, :isCorrect, CURRENT_TIMESTAMP)
    ON DUPLICATE KEY UPDATE
        answer = VALUES(answer),
        is_correct = VALUES(is_correct),
        submitted_at = CURRENT_TIMESTAMP
    """, nativeQuery = true)
    void upsertSubmission(
            @Param("userId") int userId,
            @Param("contestId") int contestId,
            @Param("problemId") int problemId,
            @Param("answer") String answer,
            @Param("isCorrect") boolean isCorrect
    );

    @Query(value = """
    SELECT
        u.name AS name,
        SUM(cs.is_correct) AS correct,
        COUNT(DISTINCT cs.problem_id) AS total_attempted,
        SUM(CASE WHEN cs.is_correct = 1 THEN 4 ELSE -1 END) AS score,
        -- HERE IS THE FIX: Cast the time calculation to a CHAR (string)
        CAST(SEC_TO_TIME(TIMESTAMPDIFF(SECOND, c.start_time, MAX(cs.submitted_at))) AS CHAR) AS finishTime
    FROM contest_submissions cs
    JOIN user u ON cs.user_id = u.id 
    JOIN contests c ON cs.contest_id = c.id
    WHERE cs.contest_id = :contestId
    GROUP BY cs.user_id, u.name
    ORDER BY
        score DESC,
        finishTime ASC
    """, nativeQuery = true)
    List<Object[]> getLeaderboardByContestId(@Param("contestId") Integer contestId);

}
