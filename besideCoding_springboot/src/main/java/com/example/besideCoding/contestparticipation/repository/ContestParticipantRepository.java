package com.example.besideCoding.contestparticipation.repository;

import com.example.besideCoding.contest.model.Contest;
import com.example.besideCoding.contestparticipation.model.ContestParticipant;
import com.example.besideCoding.signup.model.Users;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ContestParticipantRepository extends JpaRepository<ContestParticipant, Long> {
    Optional<ContestParticipant> findByUserAndContest(Users user, Contest contest);

    int countByUser(Users user);

    int countByContest(Contest contest);

    List<ContestParticipant> findByContest(Contest contest);
}
