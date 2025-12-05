package com.resume.dto;

import java.util.Map;

public class CoverLetterRequest {
    private Map<String, Object> resume; // the resume JSON
    private String jobRole;
    private String company; // optional
    private String jobTitle; // optional
    private Integer lengthInWords; // optional: preferred length

    public CoverLetterRequest() {}

    public Map<String, Object> getResume() { return resume; }
    public void setResume(Map<String, Object> resume) { this.resume = resume; }

    public String getJobRole() { return jobRole; }
    public void setJobRole(String jobRole) { this.jobRole = jobRole; }

    public String getCompany() { return company; }
    public void setCompany(String company) { this.company = company; }

    public String getJobTitle() { return jobTitle; }
    public void setJobTitle(String jobTitle) { this.jobTitle = jobTitle; }

    public Integer getLengthInWords() { return lengthInWords; }
    public void setLengthInWords(Integer lengthInWords) { this.lengthInWords = lengthInWords; }
}

