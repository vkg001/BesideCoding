package com.example.besideCoding.contest.controller;


import com.example.besideCoding.contest.dto.ContestCreateRequestDTO;
import com.example.besideCoding.contest.dto.ContestResponseDTO;
import com.example.besideCoding.contest.service.ContestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
    @RequestMapping("/api/admin/contest")
    public class AdminContestController {

        @Autowired
        private ContestService contestService;

        @PostMapping("/create")
        public ResponseEntity<String> createContest(@RequestBody ContestCreateRequestDTO dto) {
            contestService.createContest(dto);
            return ResponseEntity.ok("Contest created successfully.");
        }

        @GetMapping("/all")
        public ResponseEntity<List<ContestResponseDTO>> getAllContests() {
            return ResponseEntity.ok(contestService.getAllContests());
        }

        // Admin can see upcoming and past if needed too
    }


