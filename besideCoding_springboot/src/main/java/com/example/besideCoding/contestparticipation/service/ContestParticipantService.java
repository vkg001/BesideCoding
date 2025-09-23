package com.example.besideCoding.contestparticipation.service;

import com.example.besideCoding.contest.model.Contest;
import com.example.besideCoding.contestparticipation.model.ContestParticipant;
import com.example.besideCoding.contestparticipation.repository.ContestParticipantRepository;
import com.example.besideCoding.signup.model.User;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ContestParticipantService {

    private final ContestParticipantRepository repository;

    public boolean hasUserEndedContest(User user, Contest contest) {
        return repository.findByUserAndContest(user, contest)
                .map(ContestParticipant::isEnded)
                .orElse(false);
    }

    public void markUserJoined(User user, Contest contest) {
        Optional<ContestParticipant> existing = repository.findByUserAndContest(user, contest);
        if (existing.isEmpty()) {
            repository.save(ContestParticipant.builder()
                    .user(user)
                    .contest(contest)
                    .ended(false)
                    .build());
        }
    }

    public boolean markUserEnded(User user, Contest contest) {
        Optional<ContestParticipant> participantOpt = repository.findByUserAndContest(user, contest);

        if (participantOpt.isPresent()) {
            ContestParticipant cp = participantOpt.get();
            cp.setEnded(true);
            repository.save(cp);
            return true; // The record was found and updated.
        }

        return false; // No record was found.
    }

    public int countContestsByUser(User user) {
        return repository.countByUser(user);
    }

    public int countUsersByContest(Contest contest) {
        return repository.countByContest(contest);
    }
}
