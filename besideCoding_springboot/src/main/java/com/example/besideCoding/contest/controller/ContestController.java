//package com.example.besideCoding.contest.controller;
//
//import com.example.besideCoding.contest.dto.ContestCreateRequestDTO;
//import com.example.besideCoding.contest.dto.ContestResponseDTO;
//import com.example.besideCoding.contest.model.Contest;
//import com.example.besideCoding.contest.service.ContestService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import java.time.LocalDateTime;
//import java.util.List;
//
//@RestController
//@RequestMapping("/api/admin/contest")
//public class ContestController {
//
//    @Autowired
//    private ContestService contestService;
//
//
//    @PostMapping("/create")
//    public ResponseEntity<String> createContest(@RequestBody ContestCreateRequestDTO dto) {
//        contestService.createContest(dto);
//        return ResponseEntity.ok("Contest created successfully.");
//    }
//
//    @GetMapping("/all")
//    public ResponseEntity<List<ContestResponseDTO>> getAllContests() {
//        return ResponseEntity.ok(contestService.getAllContests());
//    }
//
//    @GetMapping("/upcoming")
//    public ResponseEntity<List<ContestResponseDTO>> getUpcomingContests() {
//        return ResponseEntity.ok(contestService.getUpcomingContests());
//    }
//
//    @GetMapping("/past")
//    public ResponseEntity<List<ContestResponseDTO>> getPastContests() {
//        return ResponseEntity.ok(contestService.getPastContests());
//    }
//
//
//}
