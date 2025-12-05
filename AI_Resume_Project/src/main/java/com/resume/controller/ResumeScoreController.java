package com.resume.controller;


import com.resume.dto.ScoreResult;
import com.resume.service.ResumeScoringService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/resume")
@CrossOrigin("*")
public class ResumeScoreController {

    private final ResumeScoringService scoringService;

    public ResumeScoreController(ResumeScoringService scoringService) {
        this.scoringService = scoringService;
    }

    // Expect body: { "data": { ...resume JSON... }, "jobRole":"Software Developer" }
    @PostMapping("/score")
    public ResponseEntity<ScoreResult> scoreResume(@RequestBody Map<String, Object> payload) {
        Object dataObj = payload.get("data");
        String jobRole = payload.getOrDefault("jobRole","").toString();
        Map<String,Object> resumeData;
        if (dataObj instanceof Map) resumeData = (Map<String,Object>) dataObj;
        else resumeData = payload; // fallback: user sends raw resume object

        ScoreResult result = scoringService.scoreResume(resumeData, jobRole);
        return ResponseEntity.ok(result);
    }
}
