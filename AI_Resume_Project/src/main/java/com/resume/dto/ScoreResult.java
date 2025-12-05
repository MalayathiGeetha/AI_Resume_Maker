package com.resume.dto;

import java.util.List;
import java.util.Map;

public class ScoreResult {
    private int overallScore;                 // 0-100
    private Map<String,Integer> categoryScores; // scores per category
    private List<String> suggestions;         // short actionable improvements
    private List<String> strengths;           // what's good
    private Map<String,Object> details;       // optional details for each category

    // getters / setters
    public int getOverallScore() { return overallScore; }
    public void setOverallScore(int overallScore) { this.overallScore = overallScore; }
    public Map<String,Integer> getCategoryScores() { return categoryScores; }
    public void setCategoryScores(Map<String,Integer> categoryScores) { this.categoryScores = categoryScores; }
    public List<String> getSuggestions() { return suggestions; }
    public void setSuggestions(List<String> suggestions) { this.suggestions = suggestions; }
    public List<String> getStrengths() { return strengths; }
    public void setStrengths(List<String> strengths) { this.strengths = strengths; }
    public Map<String,Object> getDetails() { return details; }
    public void setDetails(Map<String,Object> details) { this.details = details; }
}

