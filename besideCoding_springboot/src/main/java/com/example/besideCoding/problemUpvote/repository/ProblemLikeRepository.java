package com.example.besideCoding.problemUpvote.repository;

import com.example.besideCoding.problemUpvote.model.ProblemLike;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProblemLikeRepository extends JpaRepository<ProblemLike, Long> {

    @Query(value = "SELECT COUNT(*) FROM problem_likes WHERE problem_id = :problemId AND status = 'LIKE'", nativeQuery = true)
    int countLikes(@Param("problemId") Long problemId);

    @Query(value = "SELECT COUNT(*) FROM problem_likes WHERE problem_id = :problemId AND status = 'DISLIKE'", nativeQuery = true)
    int countDislikes(@Param("problemId") Long problemId);

    Optional<ProblemLike> findByUserIdAndProblemId(Long userId, Long problemId);
}
