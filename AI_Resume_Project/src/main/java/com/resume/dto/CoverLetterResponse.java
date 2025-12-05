package com.resume.dto;

public class CoverLetterResponse {
    private String subject;
    private String coverLetter;     // full cover letter text (multi-paragraph)
    private String shortPitch;      // 1-2 sentence elevator pitch (optional)

    public CoverLetterResponse() {}

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public String getCoverLetter() { return coverLetter; }
    public void setCoverLetter(String coverLetter) { this.coverLetter = coverLetter; }

    public String getShortPitch() { return shortPitch; }
    public void setShortPitch(String shortPitch) { this.shortPitch = shortPitch; }
}
