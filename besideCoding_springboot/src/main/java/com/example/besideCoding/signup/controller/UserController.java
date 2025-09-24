package com.example.besideCoding.signup.controller;

import com.example.besideCoding.signup.dto.EditProfileRequestDTO;
import com.example.besideCoding.signup.model.User;
import com.example.besideCoding.signup.service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.function.client.WebClient;


import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
 // React origin
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private WebClient.Builder webClientBuilder;

    @PostMapping("/signup")
    public ResponseEntity<Map<String, Object>> signup(@RequestBody User user, HttpSession session) {
        if (userService.emailExists(user.getEmail())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("message", "Email already exists"));
        }

        User savedUser = userService.createUser(user); // Update this to return User
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

        User user = userService.signInUser(email, password);
        if (user == null) {
            Map<String, Object> error = new HashMap<>();
            error.put("message", "Invalid credentials");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }

        // Store user ID in session
        session.setAttribute("userId", user.getId());
        System.out.println("User ID " + user.getId() + " stored in session");

        // Prepare response with is_admin
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Login successful");
        response.put("userId", user.getId());
        response.put("is_admin", user.is_admin()); // assuming getIsAdmin() returns 0 or 1

        return ResponseEntity.ok(response);
    }

    @PostMapping("/auth/google")
    public ResponseEntity<?> googleSignIn(@RequestBody Map<String, String> payload, HttpSession session) {
        String accessToken = payload.get("access_token");

        if (accessToken == null || accessToken.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Google access token is missing."));
        }

        try {
            // Build the WebClient for this specific request
            WebClient webClient = webClientBuilder.build();

            // Use WebClient to call Google's userinfo endpoint
            Map<String, Object> userInfo = webClient
                    .get()
                    .uri("https://www.googleapis.com/oauth2/v3/userinfo")
                    .headers(headers -> headers.setBearerAuth(accessToken))
                    .retrieve() // Executes the request
                    .bodyToMono(Map.class) // Converts the response body to a Mono<Map>
                    .block(); // Blocks until the response is received (makes it synchronous)

            if (userInfo == null) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("message", "Failed to retrieve user info from Google."));
            }

            // Extract user info from the response
            String email = (String) userInfo.get("email");
            String name = (String) userInfo.get("name");
            String pictureUrl = (String) userInfo.get("picture");

            // Use your service to find or create the user
            User user = userService.findOrCreateGoogleUser(email, name, pictureUrl);

            // Set the session
            session.setAttribute("userId", user.getId());

            // Return a successful response
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


    @PostMapping("/profile/edit") // Make sure this path is correct (was /api/profile/edit before, now should be /profile/edit due to class-level /api)
    public ResponseEntity<String> updateProfileMultipart(
            @RequestParam("data") String data,
            @RequestParam(value = "image", required = false) MultipartFile imageFile,
            HttpSession session
    ) {
        Object userIdAttribute = session.getAttribute("userId");

        if (userIdAttribute == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not logged in");
        }

        Integer userId;
        if (userIdAttribute instanceof Number) {
            userId = ((Number) userIdAttribute).intValue();
        } else {
            // This case indicates an unexpected type in the session for userId.
            System.err.println("Error: Session attribute 'userId' is not a numeric type. Found: " + userIdAttribute.getClass().getName());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Invalid user ID format in session.");
        }

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
            e.printStackTrace(); // Log the full stack trace for debugging
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to update profile: " + e.getMessage());
        }
    }



    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.ok("Logged out");
    }


}
