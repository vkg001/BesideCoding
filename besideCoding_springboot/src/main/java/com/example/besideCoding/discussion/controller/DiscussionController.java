package com.example.besideCoding.discussion.controller;

import com.example.besideCoding.discussion.dto.DiscussionFilterRequestDTO;
import com.example.besideCoding.discussion.dto.DiscussionRequestDTO;
import com.example.besideCoding.discussion.dto.DiscussionResponseDTO;
import com.example.besideCoding.discussion.repository.DiscussionProjection;
import com.example.besideCoding.discussion.service.DiscussionService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/discussions")
@RequiredArgsConstructor
//@CrossOrigin(origins = "*")
public class DiscussionController {

    private final DiscussionService discussionService;

    @PostMapping
    public void create(@RequestBody DiscussionRequestDTO dto) {
        discussionService.createDiscussion(dto);
    }

    @GetMapping
    public List<DiscussionProjection> getAll() {
        return discussionService.getAll();
    }

    @GetMapping("/type/{type}")
    public List<DiscussionProjection> getByType(@PathVariable String type) {
        return discussionService.getByType(type);
    }

    @GetMapping("/newest")
    public List<DiscussionProjection> getNewest() {
        return discussionService.getByNewest();
    }

    @GetMapping("/most-liked")
    public List<DiscussionProjection> getMostLiked() {
        return discussionService.getByMostLiked();
    }

    @PostMapping("/filter")
    public List<DiscussionProjection> getFilteredDiscussions(@RequestBody DiscussionFilterRequestDTO filterDto) {
        return discussionService.getFilteredDiscussions(filterDto.getType(), filterDto.getSort());
    }
}
