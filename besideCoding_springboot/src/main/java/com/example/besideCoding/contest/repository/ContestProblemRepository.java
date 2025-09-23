package com.example.besideCoding.contest.repository;

import com.example.besideCoding.contest.model.ContestProblem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContestProblemRepository extends JpaRepository<ContestProblem,Long> {
}
