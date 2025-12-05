package com.resume.dto;


import lombok.Data;

@Data
public class ResumeRequest {
    private String userDescription;
    private String template;  // NEW FIELD
    private String jobRole;
}
