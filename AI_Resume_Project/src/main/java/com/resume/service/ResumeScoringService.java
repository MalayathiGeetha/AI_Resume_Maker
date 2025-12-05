package com.resume.service;


import com.resume.dto.ScoreResult;

import java.util.Map;

public interface ResumeScoringService {
    ScoreResult scoreResume(Map<String, Object> resumeData, String jobRole);
}

