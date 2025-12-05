package com.resume.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.prompt.Prompt;
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
        this.chatClient = builder.build();
    }

    @Override
    public Map<String, Object> generateResumeResponse(String userResumeDescription) throws IOException {

        // Load prompt template file
        String template = loadPromptFromFile("resume_prompt.txt");

        // Replace {{userDescription}} in template
        String promptContent = template.replace("{{userDescription}}", userResumeDescription);

        // Create Prompt
        Prompt prompt = new Prompt(promptContent);

        // NEW Spring AI 1.0.0-M1 output format
        String responseText = chatClient.prompt(prompt)
                .call()
                .content();

        return parseMultipleResponses(responseText);
    }

    private String loadPromptFromFile(String filename) throws IOException {
        Path path = new ClassPathResource(filename).getFile().toPath();
        return Files.readString(path);
    }

    public static Map<String, Object> parseMultipleResponses(String response) {
        Map<String, Object> jsonResponse = new HashMap<>();

        // Remove everything before the first {
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
