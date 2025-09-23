package com.example.besideCoding.contestparticipation.model;

import com.example.besideCoding.contest.model.Contest;
import com.example.besideCoding.signup.model.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "contest_participant",
        uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "contest_id"})
)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContestParticipant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "contest_id", nullable = false)
    private Contest contest;

    private LocalDateTime joinedAt;

    private boolean ended;

    @PrePersist
    protected void onJoin() {
        this.joinedAt = LocalDateTime.now();
    }
}
