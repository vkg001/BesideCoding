package com.example.besideCoding.profile.repository;

import com.example.besideCoding.profile.model.NoOpEntity;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.query.Param;

import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;

public interface ProfileRepository extends Repository<NoOpEntity, Long> {

    // --- Projections (No change needed) ---
    interface ProfileBasicInfoProjection {
        String getName();
        String getCollege_or_company();
        String getProfile_pic();
    }
    interface CountProjection {
        Integer getCount();
    }
    interface CategoryCountProjection {
        String getCategory();
        Integer getCount();
    }
    interface TopicCountProjection {
        String getTopic();
        Integer getCount();
    }
    interface AcceptedDifficultyCountsProjection {
        Integer getEasy();
        Integer getMedium();
        Integer getHard();
    }
    interface RecentSubmissionProjection {
        String getTitle();
        Timestamp getSubmittedAt();
        Long getProblemId();
    }

    // --- Queries (Updated) ---

    // No change needed
    @Query(value = "SELECT name, college_or_company, profile_pic FROM user WHERE id = :userId", nativeQuery = true)
    Optional<ProfileBasicInfoProjection> findBasicInfoByUserId(@Param("userId") Long userId);

    /**
     * UPDATED: Counts unique solved problems by category from BOTH tables.
     * The UNION operator automatically handles uniqueness of problem_id.
     */
    @Query(value = """
    SELECT p.category AS category, COUNT(*) AS count
    FROM (
        SELECT problem_id FROM problem_submitted WHERE user_id = :userId AND submitted_status = 'solved'
        UNION
        SELECT problem_id FROM contest_submissions WHERE user_id = :userId AND is_correct = 1
    ) AS distinct_solved
    JOIN problems p ON p.id = distinct_solved.problem_id
    GROUP BY p.category
    """, nativeQuery = true)
    List<CategoryCountProjection> findCategoryCountsByUserId(@Param("userId") Long userId);

    /**
     * UPDATED: Counts unique solved problems by topic (sub_category) from BOTH tables.
     * Uses the same UNION logic as the category count.
     */
    @Query(value = """
    SELECT p.sub_category AS topic, COUNT(*) AS count
    FROM (
        SELECT problem_id FROM problem_submitted WHERE user_id = :userId AND submitted_status = 'solved'
        UNION
        SELECT problem_id FROM contest_submissions WHERE user_id = :userId AND is_correct = 1
    ) AS distinct_solved
    JOIN problems p ON p.id = distinct_solved.problem_id
    GROUP BY p.sub_category
    """, nativeQuery = true)
    List<TopicCountProjection> findTopicCountsByUserId(@Param("userId") Long userId);

    /**
     * UPDATED: Counts the total number of submissions from BOTH tables.
     * This is a simple sum of counts from each table.
     */
    @Query(value = """
        SELECT
            (SELECT COUNT(*) FROM problem_submitted WHERE user_id = :userId)
            +
            (SELECT COUNT(*) FROM contest_submissions WHERE user_id = :userId)
        AS count
    """, nativeQuery = true)
    Optional<CountProjection> findTotalSubmissionsByUserId(@Param("userId") Long userId);

    /**
     * NEW: Counts the total number of UNIQUE solved problems from BOTH tables.
     * This is needed for the 'totalSolved' field in your DTO.
     */
    @Query(value = """
        SELECT COUNT(problem_id) AS count FROM (
            SELECT problem_id FROM problem_submitted WHERE user_id = :userId AND submitted_status = 'solved'
            UNION
            SELECT problem_id FROM contest_submissions WHERE user_id = :userId AND is_correct = 1
        ) as total_solved_problems
    """, nativeQuery = true)
    Optional<CountProjection> findTotalSolvedByUserId(@Param("userId") Long userId);


    /**
     * UPDATED: Counts unique accepted problems by difficulty from BOTH tables.
     * Uses the same UNION logic to get the list of unique solved problem IDs first.
     */
    @Query(value = """
    SELECT
        COALESCE(SUM(CASE WHEN p.difficulty = 'Easy' THEN 1 ELSE 0 END), 0) AS easy,
        COALESCE(SUM(CASE WHEN p.difficulty = 'Medium' THEN 1 ELSE 0 END), 0) AS medium,
        COALESCE(SUM(CASE WHEN p.difficulty = 'Hard' THEN 1 ELSE 0 END), 0) AS hard
    FROM (
        SELECT problem_id FROM problem_submitted WHERE user_id = :userId AND submitted_status = 'solved'
        UNION
        SELECT problem_id FROM contest_submissions WHERE user_id = :userId AND is_correct = 1
    ) AS distinct_solved
    JOIN problems p ON distinct_solved.problem_id = p.id
    """, nativeQuery = true)
    Optional<AcceptedDifficultyCountsProjection> findAcceptedCountsByDifficulty(@Param("userId") Long userId);


    /**
     * UPDATED: Finds the 10 most recently solved unique problems from BOTH tables.
     * We use UNION ALL to combine all submission events, then group by problem to find the
     * most recent submission for each, and finally sort and limit.
     */
    @Query(value = """
    SELECT all_submissions.problem_id AS problemId,p.title, MAX(all_submissions.submitted_at) AS submittedAt
    FROM (
        SELECT problem_id, submitted_time AS submitted_at FROM problem_submitted
        WHERE user_id = :userId AND submitted_status = 'solved'
        UNION ALL
        SELECT problem_id, submitted_at FROM contest_submissions
        WHERE user_id = :userId AND is_correct = 1
    ) AS all_submissions
    JOIN problems p ON p.id = all_submissions.problem_id
    GROUP BY all_submissions.problem_id, p.title
    ORDER BY submittedAt DESC
    LIMIT 10
    """, nativeQuery = true)
    List<RecentSubmissionProjection> findRecentSubmissionsByUserId(@Param("userId") Long userId);

}