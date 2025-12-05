package com.resume.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.openai.OpenAiChatOptions;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.HashMap;
import java.util.Map;

@Service
public class ResumeServiceImpl implements ResumeService {

    private final ChatClient chatClient;

    public ResumeServiceImpl(ChatClient.Builder builder) {

        // Correct way for Spring AI 1.1.0
        OpenAiChatOptions options = OpenAiChatOptions.builder()
                .model("llama-3.3-70b-versatile")  // Updated working model
                .temperature(0.3)
                .build();

        this.chatClient = builder
                .defaultOptions(options)
                .build();
    }

    @Override
    public Map<String, Object> generateResumeResponse(String userDescription, String template, String jobRole) throws IOException {

        // Load base prompt
        String basePrompt = loadPromptFromFile("resume_prompt.txt");

        // Template formatting instructions
        String templateInstruction = getTemplateInstruction(template);

        // Job-role optimization instructions
        String roleOptimization = getRoleOptimization(jobRole);

        // Merge into final prompt
        String finalPrompt = basePrompt
                .replace("{{userDescription}}", userDescription)
                .replace("{{templateInstruction}}", templateInstruction)
                .replace("{{jobRoleOptimization}}", roleOptimization);

        // Create Spring AI Prompt
        Prompt prompt = new Prompt(finalPrompt);

        // Call LLM
        String responseText = chatClient
                .prompt(prompt)
                .call()
                .content();

        return parseMultipleResponses(responseText);
    }

    private String loadPromptFromFile(String filename) throws IOException {
        Path path = new ClassPathResource(filename).getFile().toPath();
        return Files.readString(path);
    }

    // -------------------------------
    // TEMPLATE-SPECIFIC INSTRUCTIONS
    // -------------------------------
    private String getTemplateInstruction(String template) {
        return switch (template) {
            case "template2" -> "Use a stylish, modern layout with bold section headers and left sidebar accent.";
            case "template3" -> "Use a formal traditional resume structure with serif fonts and box sections.";
            default -> "Use a simple, ATS-friendly layout with no icons and clean text formatting.";
        };
    }

    // -------------------------------
    // JOB ROLE OPTIMISATION LOGIC
    // -------------------------------
    private String getRoleOptimization(String jobRole) {

        if (jobRole == null || jobRole.isBlank()) {
            return "Optimize the resume for general professional roles.";
        }

        return switch (jobRole) {

            case "Software Developer" -> """
                Optimize resume for a Software Developer role.
                Emphasize: Java, Spring Boot, APIs, OOP, DSA, REST, Git, SQL, debugging, problem solving.
                Rewrite experience with action verbs and quantified achievements.
            """;

            case "Data Analyst" -> """
                Optimize resume for a Data Analyst role.
                Emphasize: SQL, Excel, Tableau, PowerBI, Python (Pandas/NumPy), Data Cleaning, Reporting.
                Rewrite bullets to show metrics, insights, KPI improvements.
            """;

            case "ML Engineer" -> """
                Optimize resume for a Machine Learning Engineer role.
                Emphasize: Model training, TensorFlow, PyTorch, ML pipelines, MLOps, deployment.
                Highlight measurable accuracy improvements and model outputs.
            """;

            case "Cloud DevOps Engineer" -> """
                Optimize resume for Cloud DevOps roles.
                Emphasize: AWS, Azure, Docker, Kubernetes, Terraform, CI/CD pipelines, Linux administration.
                Rewrite technical contributions with automation and efficiency results.
            """;

            case "Product Manager" -> """
                Optimize resume for a Product Manager role.
                Emphasize: Product strategy, user research, roadmaps, KPIs, business impact.
                Rewrite using leadership-driven, outcome-focused language.
            """;

            case "UI/UX Designer" -> """
                Optimize resume for UI/UX Designer role.
                Emphasize: Wireframing, prototyping, Figma, design systems, UX research.
                Rewrite to show usability improvements, conversions, accessibility enhancements.
            """;

            default -> "Optimize resume for general professional roles.";
        };
    }

    // -------------------------------
    // JSON PARSER
    // -------------------------------
    public static Map<String, Object> parseMultipleResponses(String response) {
        Map<String, Object> jsonResponse = new HashMap<>();

        int jsonStart = response.indexOf("{");
        int jsonEnd = response.lastIndexOf("}") + 1;

        if (jsonStart != -1 && jsonEnd != -1) {
            try {
                String jsonContent = response.substring(jsonStart, jsonEnd);
                ObjectMapper mapper = new ObjectMapper();
                jsonResponse.put("data", mapper.readValue(jsonContent, Map.class));
            } catch (Exception e) {
                jsonResponse.put("data", null);
            }
        } else {
            jsonResponse.put("data", null);
        }

        return jsonResponse;
    }
}
