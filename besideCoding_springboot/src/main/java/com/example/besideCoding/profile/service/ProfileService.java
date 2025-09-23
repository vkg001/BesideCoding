package com.example.besideCoding.profile.service;

import com.example.besideCoding.contestparticipation.service.ContestParticipantService;
import com.example.besideCoding.profile.dto.ProfileResponseDTO;
import com.example.besideCoding.profile.repository.ProfileRepository;
import com.example.besideCoding.signup.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final ProfileRepository profileRepository;

    private final UserRepository userRepository;
    private final ContestParticipantService contestParticipantService;

    @Transactional(readOnly = true)
    public ProfileResponseDTO getProfileData(Long userId) {
        ProfileResponseDTO dto = new ProfileResponseDTO();

        profileRepository.findBasicInfoByUserId(userId).ifPresent(info -> {
            dto.setName(info.getName());
            dto.setCollege_or_company(info.getCollege_or_company());
            dto.setProfile_pic(info.getProfile_pic());
        });

        userRepository.findById(userId.intValue()).ifPresent(user -> {
            int contestCount = contestParticipantService.countContestsByUser(user);
            dto.setContestsParticipated(contestCount);
        });

        profileRepository.findTotalSubmissionsByUserId(userId)
                .ifPresent(p -> dto.setTotalSubmissions(Optional.ofNullable(p.getCount()).orElse(0)));

        // Accepted counts by difficulty → for totalSolved too
        Map<String, Integer> difficultyMap = new HashMap<>();
        int totalSolved = 0;

        var accepted = profileRepository.findAcceptedCountsByDifficulty(userId);
        if (accepted.isPresent()) {
            var data = accepted.get();
            int easy = Optional.ofNullable(data.getEasy()).orElse(0);
            int medium = Optional.ofNullable(data.getMedium()).orElse(0);
            int hard = Optional.ofNullable(data.getHard()).orElse(0);
            difficultyMap.put("Easy", easy);
            difficultyMap.put("Medium", medium);
            difficultyMap.put("Hard", hard);
            totalSolved = easy + medium + hard;
        }
        dto.setAcceptedByDifficulty(difficultyMap);
        dto.setTotalSolved(totalSolved);

        Map<String, Integer> categoryMap = profileRepository.findCategoryCountsByUserId(userId)
                .stream()
                .collect(Collectors.toMap(
                        ProfileRepository.CategoryCountProjection::getCategory,
                        p -> Optional.ofNullable(p.getCount()).orElse(0)
                ));
        dto.setSubmissionsByCategory(categoryMap);

        Map<String, Integer> topicMap = profileRepository.findTopicCountsByUserId(userId)
                .stream()
                .collect(Collectors.toMap(
                        ProfileRepository.TopicCountProjection::getTopic,
                        p -> Optional.ofNullable(p.getCount()).orElse(0)
                ));
        dto.setSubmissionsByTopic(topicMap);

        List<ProfileResponseDTO.RecentSubmissionDTO> recentList = profileRepository.findRecentSubmissionsByUserId(userId)
                .stream()
                .map(projection -> {
                    ProfileResponseDTO.RecentSubmissionDTO sub = new ProfileResponseDTO.RecentSubmissionDTO();
                    sub.setTitle(projection.getTitle());
                    Timestamp ts = projection.getSubmittedAt();
                    if (ts != null) sub.setSubmittedAt(ts.toLocalDateTime());
                    sub.setProblemId(projection.getProblemId());
                    return sub;
                })
                .collect(Collectors.toList());
        dto.setRecentSubmissions(recentList);

        return dto;
    }
}
