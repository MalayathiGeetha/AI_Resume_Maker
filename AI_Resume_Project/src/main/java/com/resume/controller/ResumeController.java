package com.resume.controller;

import com.resume.dto.ResumeRequest;
import com.resume.service.ResumeService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Map;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/v1/resume")
public class ResumeController {

    private ResumeService resumeService;

    public ResumeController(ResumeService resumeService) {
        this.resumeService = resumeService;
    }


    @PostMapping("/generate")
    public ResponseEntity<Map<String, Object>> getResumeData(
            @RequestBody ResumeRequest resumeRequest
    ) throws IOException {

        Map<String, Object> stringObjectMap = resumeService.generateResumeResponse(resumeRequest.getUserDescription(),resumeRequest.getTemplate(), resumeRequest.getJobRole());
        return new ResponseEntity<>(stringObjectMap, HttpStatus.OK);

    }


}