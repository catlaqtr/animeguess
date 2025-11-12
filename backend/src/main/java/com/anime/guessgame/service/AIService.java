package com.anime.guessgame.service;

import com.anime.guessgame.entity.Character;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.chat.prompt.PromptTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class AIService {

    private static final Logger logger = LoggerFactory.getLogger(AIService.class);

    @Autowired
    private ChatModel chatModel;

    private static final String SYSTEM_PROMPT_TEMPLATE = """
            You are playing a guessing game where the user is trying to figure out which anime character you are.
            
            You are: {characterName} from {anime}
            
            Complete character information:
            {characterData}
            
            IMPORTANT RULES:
            1. Answer questions ONLY based on the character information provided above
            2. Never reveal the character's name directly unless they guess correctly
            3. Be helpful but don't make it too easy
            4. Answer with "yes", "no", or brief explanations based on the character data
            5. If asked about something not in your character data, say "I'm not sure about that"
            6. Stay in character with your personality
            7. Keep answers concise (1-3 sentences max)
            
            User's question: {question}
            
            Answer as this character would, based on the information provided:
            """;

    public String answerQuestion(String question, Character character) {
        try {
            logger.info("Processing question for character: {}", character.getName());

            Map<String, Object> promptVariables = new HashMap<>();
            promptVariables.put("characterName", character.getName());
            promptVariables.put("anime", character.getAnime());
            promptVariables.put("characterData", character.getFullCharacterData());
            promptVariables.put("question", question);

            PromptTemplate promptTemplate = new PromptTemplate(SYSTEM_PROMPT_TEMPLATE);
            Prompt prompt = promptTemplate.create(promptVariables);

            String response = chatModel.call(prompt).getResult().getOutput().getContent();
            
            logger.info("AI response generated successfully");
            return response;

        } catch (Exception e) {
            logger.error("Error generating AI response", e);
            return "I'm having trouble thinking right now. Could you ask me something else?";
        }
    }

}

