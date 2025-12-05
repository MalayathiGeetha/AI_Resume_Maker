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

        // CORRECT APPROACH FOR SPRING AI 1.1.0
        OpenAiChatOptions options = OpenAiChatOptions.builder()
                .model("llama-3.3-70b-versatile")
                .temperature(0.3)
                .build();

        this.chatClient = builder
                .defaultOptions(options)
                .build();
    }

    @Override
    public Map<String, Object> generateResumeResponse(String userDescription, String template) throws IOException {

        String basePrompt = loadPromptFromFile("resume_prompt.txt");
        String templateInstruction = getTemplateInstruction(template);

        String finalPrompt = basePrompt
                .replace("{{userDescription}}", userDescription)
                .replace("{{templateInstruction}}", templateInstruction);

        Prompt prompt = new Prompt(finalPrompt);

        // Call AI
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

    private String getTemplateInstruction(String template) {
        return switch (template) {
            case "template2" -> "Use a stylish modern layout with bold headings.";
            case "template3" -> "Use a formal traditional layout with serif fonts.";
            default -> "Use ATS-friendly minimal formatting.";
        };
    }

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
