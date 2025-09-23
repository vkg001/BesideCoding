// src/main/java/com/example/besideCoding/profile/controller/ProfileController.java
package com.example.besideCoding.profile.controller;

import com.example.besideCoding.profile.dto.ProfileResponseDTO;
import com.example.besideCoding.profile.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;

    @GetMapping("/{userId}")
    public ProfileResponseDTO getProfile(@PathVariable Long userId) {
        return profileService.getProfileData(userId);
    }
}
