package com.resume.controller;

import com.resume.dto.CoverLetterRequest;
import com.resume.dto.CoverLetterResponse;
import com.resume.service.CoverLetterService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/resume")
@CrossOrigin("*")
public class CoverLetterController {

    private final CoverLetterService coverLetterService;

    public CoverLetterController(CoverLetterService coverLetterService) {
        this.coverLetterService = coverLetterService;
    }

    @PostMapping("/cover-letter")
    public ResponseEntity<CoverLetterResponse> generateCoverLetter(@RequestBody CoverLetterRequest request) {
        CoverLetterResponse resp = coverLetterService.generateCoverLetter(request);
        return ResponseEntity.ok(resp);
    }
}
