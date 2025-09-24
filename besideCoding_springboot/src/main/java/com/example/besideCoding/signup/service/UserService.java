package com.example.besideCoding.signup.service;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;
import org.springframework.beans.factory.annotation.Value;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.example.besideCoding.signup.dto.EditProfileRequestDTO;
import com.example.besideCoding.signup.model.Users;
import com.example.besideCoding.signup.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final Cloudinary cloudinary;

    @Value("${google.client.id}")
    private String googleClientId;

    @Autowired
    public UserService(UserRepository userRepository, Cloudinary cloudinary) {
        this.userRepository = userRepository;
        this.cloudinary = cloudinary;
    }

    public boolean emailExists(String email) {
        return userRepository.countByEmail(email) > 0;
    }

    public Users createUser(Users user) {
        return userRepository.save(user);
    }

    public Users signInUser(String email, String password) {
        return userRepository.findByEmailAndPassword(email, password);
    }

    public Users findByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }

    @Transactional
    public Users verifyGoogleTokenAndGetOrCreateUser(String idTokenString) throws Exception {
        GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), JacksonFactory.getDefaultInstance())
                .setAudience(Collections.singletonList(googleClientId))
                .build();

        GoogleIdToken idToken = verifier.verify(idTokenString);
        if (idToken == null) {
            throw new IllegalArgumentException("Invalid ID token.");
        }

        GoogleIdToken.Payload payload = idToken.getPayload();

        // Extract user information from the token
        String email = payload.getEmail();
        String googleUserId = payload.getSubject(); // This is the unique, stable ID for the Google user
        String name = (String) payload.get("name");
        String pictureUrl = (String) payload.get("picture");

        // Check if user already exists with this email
        Optional<Users> userOptional = userRepository.findByEmail(email);

        if (userOptional.isPresent()) {
            // User exists, this is a SIGN-IN
            Users existingUser = userOptional.get();
            // Optional: Update their googleId or profile picture if it's missing
            if (existingUser.getGoogleId() == null) {
                existingUser.setGoogleId(googleUserId);
            }
            if (existingUser.getProfilePic() == null || existingUser.getProfilePic().isEmpty()) {
                existingUser.setProfilePic(pictureUrl);
            }
            return userRepository.save(existingUser);
        } else {
            // User does not exist, this is a SIGN-UP
            Users newUser = new Users();
            newUser.setEmail(email);
            newUser.setName(name);
            newUser.setGoogleId(googleUserId); // Store the unique Google ID
            newUser.setProfilePic(pictureUrl); // Store the Google profile picture URL

            // Users signing up with Google don't use our password system
            newUser.setPassword(null);

            // Set default values as in your model
            newUser.set_admin(false);
            newUser.setStatus(Users.Status.active);

            return userRepository.save(newUser);
        }
    }

    @Transactional // It's good practice to make this transactional
    public Users findOrCreateGoogleUser(String email, String name, String pictureUrl) {
        // Check if the user already exists by email
        Optional<Users> userOptional = userRepository.findByEmail(email);

        if (userOptional.isPresent()) {
            // User exists, return them (this is a sign-in)
            return userOptional.get();
        } else {
            // User does not exist, create a new one (this is a sign-up)
            Users newUser = new Users();
            newUser.setEmail(email);
            newUser.setName(name);
            newUser.setProfilePic(pictureUrl); // Set the profile picture from Google

            // For Google users, they don't use our password system.
            // It's good practice to leave the password field null or set it to a non-usable value.
            newUser.setPassword(null);

            // Set default values as needed by your User model
            newUser.set_admin(false);
            newUser.setStatus(Users.Status.active); // Assuming you have an enum or similar for status

            return userRepository.save(newUser);
        }
    }

    @Transactional
    public void updateProfile(Integer userId, EditProfileRequestDTO dto) {
        Users user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (dto.getName() != null  && !dto.getName().trim().isEmpty()) {
            user.setName(dto.getName());
        }
        if (dto.getEmail() != null  && !dto.getEmail().trim().isEmpty()) {
            // Add email validation if necessary
            user.setEmail(dto.getEmail());
        }
        if (dto.getBio() != null  && !dto.getBio().trim().isEmpty()) {
            user.setBio(dto.getBio());
        }
        if (dto.getCollege_or_company() != null  && !dto.getCollege_or_company().trim().isEmpty()) {
            user.setCollege_or_company(dto.getCollege_or_company());
        }
        if (dto.getGoogleId() != null  && !dto.getGoogleId().trim().isEmpty()) {
            user.setGoogleId(dto.getGoogleId());
        }
        if (dto.getLinkedinId() != null  && !dto.getLinkedinId().trim().isEmpty()) {
            user.setLinkedinId(dto.getLinkedinId());
        }
        if (dto.getGithubId() != null  && !dto.getGithubId().trim().isEmpty()) {
            user.setGithubId(dto.getGithubId());
        }
        if (dto.getPortfolioLink() != null  && !dto.getPortfolioLink().trim().isEmpty()) {
            user.setPortfolioLink(dto.getPortfolioLink());
        }

        userRepository.save(user);
    }

    public String uploadImageToCloudinary(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File to upload cannot be null or empty.");
        }
        Map<?, ?> result = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());
        String secureUrl = (String) result.get("secure_url");
        if (secureUrl == null) {
            throw new RuntimeException("Failed to get secure_url from Cloudinary response.");
        }
        return secureUrl;
    }

    @Transactional
    public void updateProfilePicture(Integer userId, String imageUrl) {
        Users user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId + " when updating profile picture."));

        if (imageUrl == null || imageUrl.trim().isEmpty()) {
            System.out.println("Image URL is null or empty for user " + userId + ". No update performed for profile picture via custom query.");
            return;
        }
        userRepository.updateProfilePic(userId, imageUrl);
    }

    public List<Users> getAllUsers() {
        return userRepository.findAll();
    }
}
