package com.resume.service;

import com.resume.dto.CoverLetterRequest;
import com.resume.dto.CoverLetterResponse;

public interface CoverLetterService {
    CoverLetterResponse generateCoverLetter(CoverLetterRequest request);
}
