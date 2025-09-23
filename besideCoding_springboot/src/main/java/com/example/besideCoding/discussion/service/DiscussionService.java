package com.example.besideCoding.discussion.service;

import com.example.besideCoding.discussion.dto.DiscussionRequestDTO;
import com.example.besideCoding.discussion.dto.DiscussionResponseDTO;
import com.example.besideCoding.discussion.model.Discussion;
import com.example.besideCoding.discussion.repository.DiscussionProjection;
import com.example.besideCoding.discussion.repository.DiscussionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;


@Service
@RequiredArgsConstructor
public class DiscussionService {

    private final DiscussionRepository discussionRepository;

    public void createDiscussion(DiscussionRequestDTO dto) {
        Discussion d = new Discussion();
        d.setUserId(dto.getUserId());
        d.setTitle(dto.getTitle());
        d.setDescription(dto.getDescription());
        d.setType(dto.getType());
        d.setCreatedAt(LocalDateTime.now());
        discussionRepository.save(d);
    }

    public List<DiscussionProjection> getAll() {
        return discussionRepository.fetchAllWithUser();
    }

    public List<DiscussionProjection> getByType(String type) {
        return discussionRepository.fetchByType(type);
    }

    public List<DiscussionProjection> getByNewest() {
        return discussionRepository.fetchByNewest();
    }

    public List<DiscussionProjection> getByMostLiked() {
        return discussionRepository.fetchByMostLiked();
    }

    public List<DiscussionProjection> getFilteredDiscussions(String type, String sort) {
        if (type != null && sort != null) {
            if (sort.equals("newest")) {
                return discussionRepository.fetchByTypeOrderByNewest(type);
            } else if (sort.equals("mostLiked")) {
                return discussionRepository.fetchByTypeOrderByLikes(type);
            }
        }

        if (type != null) {
            return discussionRepository.fetchByType(type);
        }

        if (sort != null) {
            if (sort.equals("newest")) {
                return discussionRepository.fetchByNewest();
            } else if (sort.equals("mostLiked")) {
                return discussionRepository.fetchByMostLiked();
            }
        }

        return discussionRepository.fetchAllWithUser(); // default
    }

}