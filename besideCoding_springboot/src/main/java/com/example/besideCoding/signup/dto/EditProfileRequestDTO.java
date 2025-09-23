package com.example.besideCoding.signup.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true) // Keep this to ignore genuinely unexpected fields
public class EditProfileRequestDTO {

    private String name;

    @JsonAlias("company") // Handles the "company" vs "college_or_company" case
    private String college_or_company;

    private String email;
    private String bio;

    @JsonProperty("google_id") // Explicitly maps JSON "google_id" to this field
    private String googleId;

    @JsonProperty("linkedin_id") // Explicitly maps JSON "linkedin_id" to this field
    private String linkedinId;

    @JsonProperty("github_id") // Explicitly maps JSON "github_id" to this field
    private String githubId;

    @JsonProperty("portfolio_link") // Explicitly maps JSON "portfolio_link" to this field
    private String portfolioLink;
}
