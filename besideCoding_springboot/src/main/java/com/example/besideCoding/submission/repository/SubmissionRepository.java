package com.example.besideCoding.submission.repository;

import com.example.besideCoding.submission.model.ProblemSubmitted;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SubmissionRepository extends JpaRepository<ProblemSubmitted,Integer> {
}
