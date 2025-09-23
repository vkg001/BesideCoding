package com.example.besideCoding.problemUpvote.repository;

import com.example.besideCoding.problemUpvote.model.ProblemLike;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProblemLikeRepository extends JpaRepository<ProblemLike, Long> {

    @Query(value = """
        SELECT COUNT(*) FROM problem_likes WHERE problem_id = :problemId AND status = 'LIKE'
    """, nativeQuery = true)
    int countLikes(@Param("problemId") Long problemId);

    @Query(value = """
        SELECT COUNT(*) FROM problem_likes WHERE problem_id = :problemId AND status = 'DISLIKE'
    """, nativeQuery = true)
    int countDislikes(@Param("problemId") Long problemId);

    @Query(value = """
        SELECT * FROM problem_likes WHERE user_id = :userId AND problem_id = :problemId
    """, nativeQuery = true)
    Optional<ProblemLike> findByUserIdAndProblemId(@Param("userId") Long userId, @Param("problemId") Long problemId);
}
