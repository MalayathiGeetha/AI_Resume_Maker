package com.resume.service;


import com.resume.dto.ScoreResult;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class ResumeScoringServiceImpl implements ResumeScoringService {

    // Small list of strong/action verbs (you can extend)
    private static final Set<String> STRONG_VERBS = Set.of(
            "Implemented","Designed","Engineered","Optimized","Automated","Developed",
            "Deployed","Led","Spearheaded","Enhanced","Reduced","Improved","Created",
            "Built","Architected","Streamlined","Executed","Delivered","Managed","Scaled"
    );

    // job role -> keywords (extend as needed)
    private static final Map<String, List<String>> ROLE_KEYWORDS = new HashMap<>();
    static {
        ROLE_KEYWORDS.put("Software Developer", List.of("Java","Spring","REST","API","SQL","Git","Docker","React","TypeScript"));
        ROLE_KEYWORDS.put("Data Analyst", List.of("SQL","Excel","Tableau","PowerBI","Pandas","Python","ETL","Visualization"));
        ROLE_KEYWORDS.put("ML Engineer", List.of("Python","TensorFlow","PyTorch","ML","Model","Training","Inference","DataPipeline"));
        ROLE_KEYWORDS.put("Cloud DevOps", List.of("AWS","Azure","GCP","Kubernetes","Docker","CI/CD","Terraform","Ansible"));
        ROLE_KEYWORDS.put("Product Manager", List.of("Roadmap","KPIs","Stakeholder","MVP","User Research","Metrics","Strategy"));
        ROLE_KEYWORDS.put("UI/UX Designer", List.of("Figma","Sketch","Wireframe","Prototyping","Usability","Design System"));
        ROLE_KEYWORDS.put("AI", List.of("ML","NLP","Deep Learning","Transformer","Model","AI"));
    }

    @Override
    public ScoreResult scoreResume(Map<String, Object> resumeData, String jobRole) {
        // defensive null checks
        if (resumeData == null) resumeData = new HashMap<>();

        Map<String,Integer> catScores = new LinkedHashMap<>();
        List<String> suggestions = new ArrayList<>();
        List<String> strengths = new ArrayList<>();
        Map<String,Object> details = new HashMap<>();

        // Weights (sum -> 100)
        // ATS readiness: 18, Grammar: 10, Strong verbs: 16, Impact: 20, Layout clarity: 16, Keyword match: 20
        double wATS = 18, wGrammar = 10, wVerbs = 16, wImpact = 20, wLayout = 16, wKeywords = 20;

        // 1) ATS readiness (presence of required personal info & sections)
        double atsScore = calcAtsScore(resumeData);
        catScores.put("ATS Readiness", (int)Math.round(atsScore * 100));
        details.put("atsRaw", atsScore);

        // 2) Grammar (simple heuristics)
        double grammarScore = calcGrammarScore(resumeData);
        catScores.put("Grammar", (int)Math.round(grammarScore * 100));
        details.put("grammarRaw", grammarScore);

        // 3) Strong verbs usage
        double verbScore = calcStrongVerbScore(resumeData);
        catScores.put("Strong Verbs", (int)Math.round(verbScore * 100));
        details.put("verbsRaw", verbScore);

        // 4) Impact score (numbers, % present)
        double impactScore = calcImpactScore(resumeData);
        catScores.put("Impact", (int)Math.round(impactScore * 100));
        details.put("impactRaw", impactScore);

        // 5) Layout clarity (non-empty sections, length checks)
        double layoutScore = calcLayoutScore(resumeData);
        catScores.put("Layout Clarity", (int)Math.round(layoutScore * 100));
        details.put("layoutRaw", layoutScore);

        // 6) Keyword match with job role
        double keywordScore = calcKeywordMatchScore(resumeData, jobRole);
        catScores.put("Keyword Match", (int)Math.round(keywordScore * 100));
        details.put("keywordRaw", keywordScore);
        details.put("jobRole", jobRole == null ? "" : jobRole);

        // Weighted overall
        double overall = atsScore * wATS + grammarScore * wGrammar + verbScore * wVerbs +
                impactScore * wImpact + layoutScore * wLayout + keywordScore * wKeywords;
        int overallInt = (int)Math.round(overall);

        // Suggestions & strengths (simple rules)
        if (atsScore < 0.6) suggestions.add("Add/complete personalInformation (email, phone, location) and standard sections (skills, experience, education).");
        else strengths.add("Good basic ATS structure.");

        if (grammarScore < 0.7) suggestions.add("Fix sentence grammar: ensure sentences end with punctuation and use full sentences in summary and responsibilities.");
        else strengths.add("Grammar looks decent.");

        if (verbScore < 0.5) suggestions.add("Rewrite responsibilities using strong action verbs and measurable outcomes (use the Action-Word Enhancer).");
        else strengths.add("Responsibilities use strong verbs.");

        if (impactScore < 0.5) suggestions.add("Add measurable impact (percentages, counts, time saved) to experience bullets and projects.");
        else strengths.add("Good use of measurable impact.");

        if (layoutScore < 0.6) suggestions.add("Improve layout clarity: fill education/project fields and avoid empty arrays");
        else strengths.add("Layout sections are clear.");

        if (keywordScore < 0.5) {
            suggestions.add("Include more role-specific keywords (tools, frameworks) relevant to the selected job role.");
            List<String> roleKw = ROLE_KEYWORDS.getOrDefault(jobRole, List.of());
            if (!roleKw.isEmpty()) details.put("recommendedKeywords", roleKw);
        } else strengths.add("Keywords match the selected job role.");

        ScoreResult res = new ScoreResult();
        res.setOverallScore(clamp(overallInt, 0, 100));
        res.setCategoryScores(catScores);
        res.setSuggestions(suggestions);
        res.setStrengths(strengths);
        res.setDetails(details);
        return res;
    }

    // ---- Heuristic helpers ----

    private double calcAtsScore(Map<String, Object> resume) {
        int total = 0;
        int present = 0;

        // personalInformation keys
        total += 6;
        Map<String,Object> pi = getMap(resume.get("personalInformation"));
        if (pi != null) {
            present += (pi.getOrDefault("fullName","") != null && !pi.getOrDefault("fullName","").toString().isBlank()) ? 1 : 0;
            present += (pi.getOrDefault("email","") != null && !pi.getOrDefault("email","").toString().isBlank()) ? 1 : 0;
            present += (pi.getOrDefault("phoneNumber","") != null && !pi.getOrDefault("phoneNumber","").toString().isBlank()) ? 1 : 0;
            present += (pi.getOrDefault("location","") != null && !pi.getOrDefault("location","").toString().isBlank()) ? 1 : 0;
            present += (pi.getOrDefault("linkedIn","") != null && !pi.getOrDefault("linkedIn","").toString().isBlank()) ? 1 : 0;
            present += (pi.getOrDefault("gitHub","") != null && !pi.getOrDefault("gitHub","").toString().isBlank()) ? 1 : 0;
        }

        // required sections presence
        total += 4;
        present += (hasNonEmptyList(resume.get("skills")) ? 1 : 0);
        present += (hasNonEmptyList(resume.get("experience")) ? 1 : 0);
        present += (hasNonEmptyList(resume.get("education")) ? 1 : 0);
        present += ((resume.get("summary") != null && !resume.get("summary").toString().isBlank()) ? 1 : 0);

        return present / (double) total; // 0..1
    }

    private double calcGrammarScore(Map<String, Object> resume) {
        // Basic checks: punctuation at sentence end in summary and responsibilities
        String summary = safeStr(resume.get("summary"));
        double score = 0.0;
        int checks = 0;
        if (!summary.isBlank()) {
            checks++;
            score += endsWithSentencePunctuation(summary) ? 1 : 0;
        }
        List<Object> experiences = getList(resume.get("experience"));
        if (!experiences.isEmpty()) {
            int good = 0;
            int total = 0;
            for (Object o : experiences) {
                Map<String,Object> m = getMap(o);
                if (m == null) continue;
                String r = safeStr(m.get("responsibility"));
                if (r.isBlank()) continue;
                total++;
                if (endsWithSentencePunctuation(r)) good++;
            }
            if (total > 0) {
                checks++;
                score += (double) good / total;
            }
        }
        if (checks == 0) return 0.7; // neutral
        return score / checks; // average 0..1
    }

    private double calcStrongVerbScore(Map<String, Object> resume) {
        int countBullets = 0;
        int countStrong = 0;
        List<Object> experiences = getList(resume.get("experience"));
        for (Object o : experiences) {
            Map<String,Object> m = getMap(o);
            if (m == null) continue;
            String r = safeStr(m.get("responsibility"));
            if (r.isBlank()) continue;
            countBullets++;
            String firstWord = firstWord(r).replaceAll("[^A-Za-z]","");
            if (firstWord.isBlank()) continue;
            if (STRONG_VERBS.contains(capitalize(firstWord))) countStrong++;
        }
        if (countBullets == 0) return 0.5; // neutral
        return (double) countStrong / countBullets; // 0..1
    }

    private double calcImpactScore(Map<String, Object> resume) {
        // Count numeric tokens (%, numbers) in responsibilities + projects
        int numericCount = 0;
        int totalBullets = 0;
        List<Object> experiences = getList(resume.get("experience"));
        for (Object o : experiences) {
            Map<String,Object> m = getMap(o);
            if (m == null) continue;
            String r = safeStr(m.get("responsibility"));
            if (r.isBlank()) continue;
            totalBullets++;
            if (containsNumberOrPercent(r)) numericCount++;
        }
        List<Object> projects = getList(resume.get("projects"));
        for (Object o : projects) {
            Map<String,Object> m = getMap(o);
            if (m == null) continue;
            String desc = safeStr(m.get("description"));
            if (desc.isBlank()) continue;
            totalBullets++;
            if (containsNumberOrPercent(desc)) numericCount++;
        }

        if (totalBullets == 0) return 0.4;
        return Math.min(1.0, (double) numericCount / totalBullets + 0.1); // a bit generous
    }

    private double calcLayoutScore(Map<String,Object> resume) {
        int sections = 0;
        int present = 0;
        // consider sections: summary, skills, experience, education, projects, certifications
        sections += 6;
        if (resume.get("summary") != null && !resume.get("summary").toString().isBlank()) present++;
        if (hasNonEmptyList(resume.get("skills"))) present++;
        if (hasNonEmptyList(resume.get("experience"))) present++;
        if (hasNonEmptyList(resume.get("education"))) present++;
        if (hasNonEmptyList(resume.get("projects"))) present++;
        if (hasNonEmptyList(resume.get("certifications"))) present++;

        return present / (double) sections;
    }

    private double calcKeywordMatchScore(Map<String,Object> resume, String jobRole) {
        if (jobRole == null) return 0.5;
        List<String> keywords = ROLE_KEYWORDS.getOrDefault(jobRole, Collections.emptyList());
        if (keywords.isEmpty()) return 0.5;

        String combined = resumeToText(resume).toLowerCase();
        int found = 0;
        for (String kw: keywords) {
            if (combined.contains(kw.toLowerCase())) found++;
        }
        return (double) found / keywords.size();
    }

    // ---------- small util helpers ----------
    private static Map<String,Object> getMap(Object o) {
        if (o instanceof Map) return (Map<String,Object>) o;
        return null;
    }
    private static List<Object> getList(Object o) {
        if (o instanceof List) return (List<Object>) o;
        return Collections.emptyList();
    }
    private static boolean hasNonEmptyList(Object o) {
        List<Object> l = getList(o);
        return l != null && !l.isEmpty();
    }
    private static String safeStr(Object o) {
        return o == null ? "" : o.toString();
    }
    private static boolean endsWithSentencePunctuation(String s) {
        s = s.trim();
        return s.endsWith(".") || s.endsWith("?") || s.endsWith("!");
    }
    private static String firstWord(String s) {
        if (s == null) return "";
        String[] parts = s.trim().split("\\s+");
        return parts.length>0?parts[0]:"";
    }
    private static boolean containsNumberOrPercent(String s) {
        Pattern p = Pattern.compile("(\\d+%?)");
        Matcher m = p.matcher(s);
        return m.find();
    }
    private static int clamp(int v, int lo, int hi) {
        return Math.max(lo, Math.min(hi, v));
    }
    private static String capitalize(String s) {
        if (s==null || s.isBlank()) return s;
        return s.substring(0,1).toUpperCase() + s.substring(1).toLowerCase();
    }
    private static String resumeToText(Map<String,Object> resume) {
        StringBuilder sb = new StringBuilder();
        if (resume == null) return "";
        // personalInformation
        Map<String,Object> pi = getMap(resume.get("personalInformation"));
        if (pi!=null) for (Object v: pi.values()) sb.append(" ").append(v);
        if (resume.get("summary")!=null) sb.append(" ").append(resume.get("summary"));
        List<Object> lists = List.of("skills","experience","projects","education","certifications","achievements","languages","interests");
        for (Object key : lists) {
            Object val = resume.get(key.toString());
            if (val instanceof List) {
                for (Object item : (List<?>)val) {
                    if (item instanceof Map) {
                        for (Object v : ((Map<?,?>) item).values()) sb.append(" ").append(String.valueOf(v));
                    } else {
                        sb.append(" ").append(String.valueOf(item));
                    }
                }
            }
        }
        return sb.toString();
    }
}

