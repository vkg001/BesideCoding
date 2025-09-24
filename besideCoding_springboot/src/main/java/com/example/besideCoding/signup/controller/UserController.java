package com.example.besideCoding.signup.controller;

import com.example.besideCoding.signup.dto.EditProfileRequestDTO;
import com.example.besideCoding.signup.model.Users;
import com.example.besideCoding.signup.service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestClient;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class UserController {

    private final UserService userService;
    private final RestClient restClient;

    // Constructor-based injection is a best practice
    public UserController(UserService userService, RestClient restClient) {
        this.userService = userService;
        this.restClient = restClient;
    }

    @PostMapping("/signup")
    public ResponseEntity<Map<String, Object>> signup(@RequestBody Users user, HttpSession session) {
        if (userService.emailExists(user.getEmail())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("message", "Email already exists"));
        }

        Users savedUser = userService.createUser(user);
        session.setAttribute("userId", savedUser.getId());

        return ResponseEntity.ok(Map.of(
                "message", "Signup successful",
                "userId", savedUser.getId(),
                "is_admin", savedUser.is_admin()
        ));
    }

    @PostMapping("/signin")
    public ResponseEntity<Map<String, Object>> signin(@RequestBody Map<String, String> request, HttpSession session) {
        String email = request.get("email");
        String password = request.get("password");

        Users user = userService.signInUser(email, password);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Invalid credentials"));
        }

        session.setAttribute("userId", user.getId());

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Login successful");
        response.put("userId", user.getId());
        response.put("is_admin", user.is_admin());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/auth/google")
    public ResponseEntity<?> googleSignIn(@RequestBody Map<String, String> payload, HttpSession session) {
        String accessToken = payload.get("access_token");

        if (accessToken == null || accessToken.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Google access token is missing."));
        }

        try {
            // ✅ Use RestClient to call Google's userinfo endpoint
            Map<String, Object> userInfo = restClient
                    .get()
                    .uri("https://www.googleapis.com/oauth2/v3/userinfo")
                    .headers(headers -> headers.setBearerAuth(accessToken))
                    .retrieve()
                    .body(Map.class); // Simpler API, no .block() needed

            if (userInfo == null) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("message", "Failed to retrieve user info from Google."));
            }

            String email = (String) userInfo.get("email");
            String name = (String) userInfo.get("name");
            String pictureUrl = (String) userInfo.get("picture");

            Users user = userService.findOrCreateGoogleUser(email, name, pictureUrl);
            session.setAttribute("userId", user.getId());

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Google Sign-In successful");
            response.put("userId", user.getId());
            response.put("is_admin", user.is_admin());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("message", "An internal error occurred during Google sign-in."));
        }
    }

    @GetMapping("/session-user")
    public ResponseEntity<Map<String, Object>> getSessionUser(HttpSession session) {
        Object userId = session.getAttribute("userId");
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(Map.of("userId", userId));
    }

    @PostMapping("/profile/edit")
    public ResponseEntity<String> updateProfileMultipart(
            @RequestParam("data") String data,
            @RequestParam(value = "image", required = false) MultipartFile imageFile,
            HttpSession session
    ) {
        Object userIdAttribute = session.getAttribute("userId");
        if (userIdAttribute == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not logged in");
        }

        Integer userId = ((Number) userIdAttribute).intValue();

        try {
            ObjectMapper objectMapper = new ObjectMapper();
            EditProfileRequestDTO dto = objectMapper.readValue(data, EditProfileRequestDTO.class);
            userService.updateProfile(userId, dto);

            if (imageFile != null && !imageFile.isEmpty()) {
                String imageUrl = userService.uploadImageToCloudinary(imageFile);
                userService.updateProfilePicture(userId, imageUrl);
            }
            return ResponseEntity.ok("Profile updated successfully");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to update profile: " + e.getMessage());
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.ok("Logged out");
    }
}