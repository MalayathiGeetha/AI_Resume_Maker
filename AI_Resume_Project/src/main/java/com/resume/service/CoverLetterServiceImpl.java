package com.resume.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.resume.dto.CoverLetterRequest;
import com.resume.dto.CoverLetterResponse;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class CoverLetterServiceImpl implements CoverLetterService {

    private final ChatClient chatClient;
    private final ObjectMapper mapper = new ObjectMapper();

    public CoverLetterServiceImpl(ChatClient.Builder builder) {
        this.chatClient = builder.build();
    }

    @Override
    public CoverLetterResponse generateCoverLetter(CoverLetterRequest request) {

        String promptText = buildPrompt(request);
        Prompt prompt = new Prompt(promptText);

        try {
            String aiResp = chatClient.prompt(prompt).call().content();

            CoverLetterResponse resp = new CoverLetterResponse();

            // Try JSON extraction
            int jsonStart = aiResp.indexOf("{");
            int jsonEnd = aiResp.lastIndexOf("}") + 1;

            if (jsonStart != -1 && jsonEnd != -1) {
                try {
                    String json = aiResp.substring(jsonStart, jsonEnd);
                    JsonNode node = mapper.readTree(json);

                    resp.setSubject(node.path("subject").asText(null));
                    resp.setCoverLetter(node.path("coverLetter").asText(node.path("letter").asText(aiResp)));
                    resp.setShortPitch(node.path("shortPitch").asText(null));

                    return resp;

                } catch (Exception ignore) {}
            }

            // fallback
            resp.setCoverLetter(aiResp.trim());
            resp.setSubject(buildSubjectFromRequest(request));
            return resp;

        } catch (Exception e) {
            CoverLetterResponse fallback = new CoverLetterResponse();
            fallback.setSubject(buildSubjectFromRequest(request));
            fallback.setCoverLetter(buildFallbackCoverLetter(request));
            return fallback;
        }
    }

    private String buildPrompt(CoverLetterRequest request) {

        String candidateName = safeLookup(request.getResume(), "personalInformation", "fullName");
        String topSkills = safeExtractSkills(request.getResume());
        String summary = safeLookup(request.getResume(), "summary");

        String company = request.getCompany() == null ? "[Company]" : request.getCompany();
        String jobTitle = request.getJobTitle() != null ? request.getJobTitle() : request.getJobRole();
        if (jobTitle == null) jobTitle = "[Job Title]";

        int len = request.getLengthInWords() == null ? 220 : request.getLengthInWords();

        String instruction = """
                You are an expert career writer. Generate a professional JSON-only cover letter for the candidate.
                Keys required: subject, coverLetter, shortPitch.
                
                Rules:
                - 3–5 paragraphs
                - About %d words
                - First paragraph: hook referencing company + role
                - Second paragraph: connect resume experience & skills
                - Third paragraph: measurable impact & closing
                - No text outside JSON
                """.formatted(len);

        return "INPUT RESUME:\n" + prettyJsonSafe(request.getResume()) + "\n\n" +
                "Candidate Name: " + candidateName + "\n" +
                "Summary: " + summary + "\n" +
                "Skills: " + topSkills + "\n\n" +
                "Job Role: " + jobTitle + "\n" +
                "Company: " + company + "\n\n" +
                instruction +
                "\n\nJSON Example:\n" +
                "{\n" +
                "  \"subject\": \"Application for Software Developer\",\n" +
                "  \"shortPitch\": \"Backend developer specializing in scalable REST APIs.\",\n" +
                "  \"coverLetter\": \"Dear Hiring Manager...\"\n" +
                "}\n\n" +
                "Now generate only JSON.";
    }

    private String buildSubjectFromRequest(CoverLetterRequest request) {
        String name = safeLookup(request.getResume(), "personalInformation", "fullName");
        String role = request.getJobTitle() != null ? request.getJobTitle() : request.getJobRole();
        if (name.isBlank()) name = "Candidate";
        if (role == null || role.isBlank()) role = "Application";
        return "Application: " + role + " — " + name;
    }

    private String buildFallbackCoverLetter(CoverLetterRequest request) {
        String name = safeLookup(request.getResume(), "personalInformation", "fullName");
        String company = request.getCompany() == null ? "Company" : request.getCompany();
        String role = request.getJobTitle() != null ? request.getJobTitle() : request.getJobRole();
        if (role == null) role = "this role";

        return String.format(
                "Dear Hiring Manager at %s,\n\n" +
                        "I am %s and I am applying for the %s position. With experience in %s, I am confident in my ability to contribute to your team.\n\n" +
                        "Thank you for considering my application.\n\nSincerely,\n%s",
                company,
                (name.isBlank() ? "a motivated candidate" : name),
                role,
                safeExtractSkills(request.getResume()),
                (name.isBlank() ? "" : name)
        );
    }

    // ---------------------- FIXED HELPERS ----------------------

    // ✓ 2-argument version
    private String safeLookup(Map<String, Object> resume, String key) {
        return safeLookup(resume, key, "");
    }

    // ✓ 3-argument version (existing)
    private String safeLookup(Map<String, Object> resume, String section, String key) {
        if (resume == null) return "";
        Object sec = resume.get(section);
        if (!(sec instanceof Map)) return "";
        Object val = ((Map<?, ?>) sec).get(key);
        return val == null ? "" : val.toString();
    }

    private String safeExtractSkills(Map<String, Object> resume) {
        if (resume == null) return "";
        Object skillsObj = resume.get("skills");
        if (!(skillsObj instanceof java.util.List<?> list)) return "";

        StringBuilder sb = new StringBuilder();
        for (Object skill : list) {
            if (skill instanceof Map<?, ?> map) {
                Object title = map.get("title");
                if (title != null) {
                    if (sb.length() > 0) sb.append(", ");
                    sb.append(title.toString());
                }
            }
        }
        return sb.toString();
    }

    private String prettyJsonSafe(Object obj) {
        try {
            return mapper.writerWithDefaultPrettyPrinter().writeValueAsString(obj);
        } catch (Exception e) {
            return "{}";
        }
    }
}
