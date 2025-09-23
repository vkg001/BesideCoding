package com.example.besideCoding.contest.repository;

import com.example.besideCoding.contest.model.Contest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ContestRepository extends JpaRepository<Contest, Integer> {
    List<Contest> findByStartTimeAfter(LocalDateTime now);

    List<Contest> findByEndTimeBefore(LocalDateTime now);

    List<Contest> findByStartTimeBeforeAndEndTimeAfter(LocalDateTime startTime, LocalDateTime endTime);
}
