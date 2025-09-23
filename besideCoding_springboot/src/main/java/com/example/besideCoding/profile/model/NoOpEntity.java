package com.example.besideCoding.profile.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Data;

@Entity
@Data
public class NoOpEntity {
    @Id
    private Long id; // JPA entities require an @Id field

    // Constructor, getters, setters are optional if not used,
    // but an @Id is mandatory.
    public NoOpEntity() {}
}
