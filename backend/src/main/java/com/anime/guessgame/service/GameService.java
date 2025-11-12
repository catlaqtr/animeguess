package com.anime.guessgame.service;

import com.anime.guessgame.dto.GameResponse;
import com.anime.guessgame.dto.QuestionAnswerResponse;
import com.anime.guessgame.entity.Character;
import com.anime.guessgame.entity.Game;
import com.anime.guessgame.entity.Question;
import com.anime.guessgame.entity.User;
import com.anime.guessgame.exception.ResourceNotFoundException;
import com.anime.guessgame.repository.CharacterRepository;
import com.anime.guessgame.repository.GameRepository;
import com.anime.guessgame.repository.QuestionRepository;
import com.anime.guessgame.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class GameService {

    private static final Logger logger = LoggerFactory.getLogger(GameService.class);

    @Autowired
    private GameRepository gameRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CharacterRepository characterRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private AIService aiService;

    @Transactional
    public GameResponse startNewGame(String username) {
        logger.info("Starting new game for user: {}", username);

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // End any active games for this user
        gameRepository.findActiveGameByUserId(user.getId()).ifPresent(game -> {
            game.setStatus(Game.GameStatus.LOST);
            game.setEndedAt(LocalDateTime.now());
            gameRepository.save(game);
            logger.info("Ended previous active game: {}", game.getId());
        });

        // Select random character
        Character character = characterRepository.findRandomActiveCharacter()
                .orElseThrow(() -> new ResourceNotFoundException("No active characters found"));

        // Create new game
        Game game = Game.builder()
                .user(user)
                .character(character)
                .status(Game.GameStatus.ACTIVE)
                .questionsCount(0)
                .guessedCorrectly(false)
                .build();

        game = gameRepository.save(game);
        logger.info("New game started: {} with character: {}", game.getId(), character.getName());

        return buildGameResponse(game, false);
    }

    @Transactional
    public QuestionAnswerResponse askQuestion(String username, String questionText) {
        logger.info("User {} asking question: {}", username, questionText);

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Game game = gameRepository.findActiveGameByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("No active game found. Please start a new game."));

        // Get AI response
        String answer = aiService.answerQuestion(questionText, game.getCharacter());

        // Save question
        Question question = Question.builder()
                .game(game)
                .questionText(questionText)
                .answerText(answer)
                .build();

        questionRepository.save(question);

        // Update game
        game.incrementQuestionsCount();
        gameRepository.save(game);

        logger.info("Question answered for game: {}", game.getId());

        return QuestionAnswerResponse.builder()
                .question(questionText)
                .answer(answer)
                .totalQuestions(game.getQuestionsCount())
                .build();
    }

    @Transactional
    public GameResponse submitGuess(String username, String guessedName) {
        logger.info("User {} submitting guess: {}", username, guessedName);

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Game game = gameRepository.findActiveGameByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("No active game found"));

        Character character = game.getCharacter();
        boolean isCorrect = isGuessCorrect(character.getName(), guessedName);

        game.setStatus(isCorrect ? Game.GameStatus.WON : Game.GameStatus.LOST);
        game.setGuessedCorrectly(isCorrect);
        game.setFinalGuess(guessedName);
        game.setEndedAt(LocalDateTime.now());

        gameRepository.save(game);

        logger.info("Game {} ended. Result: {}", game.getId(), isCorrect ? "WON" : "LOST");

        return buildGameResponse(game, true);
    }

    /**
     * Flexible guess matching that accepts partial names
     * Examples:
     * - "luffy" matches "Monkey D. Luffy"
     * - "naruto" matches "Naruto Uzumaki"
     * - "monkey d luffy" matches "Monkey D. Luffy"
     */
    private boolean isGuessCorrect(String actualName, String guessedName) {
        String normalizedActual = actualName.toLowerCase().trim();
        String normalizedGuess = guessedName.toLowerCase().trim();
        
        // Exact match
        if (normalizedActual.equals(normalizedGuess)) {
            return true;
        }
        
        // Split the actual name into parts (e.g., "Monkey D. Luffy" -> ["monkey", "d", "luffy"])
        String[] actualParts = normalizedActual.split("[\\s.]+");
        String[] guessParts = normalizedGuess.split("[\\s.]+");
        
        // Check if guess contains any significant part of the actual name
        // (ignoring single letters like middle initials)
        for (String guessPart : guessParts) {
            if (guessPart.length() > 1) { // Ignore single letters
                for (String actualPart : actualParts) {
                    if (actualPart.length() > 1 && actualPart.equals(guessPart)) {
                        return true; // Match found (e.g., "luffy" matches "luffy" in "Monkey D. Luffy")
                    }
                }
            }
        }
        
        // Check if the guess is contained in the actual name (for compound names)
        if (normalizedActual.contains(normalizedGuess)) {
            return true;
        }
        
        return false;
    }

    @Transactional(readOnly = true)
    public GameResponse getCurrentGame(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Game game = gameRepository.findActiveGameByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("No active game found"));

        return buildGameResponse(game, false);
    }

    @Transactional(readOnly = true)
    public List<GameResponse> getUserGameHistory(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        List<Game> games = gameRepository.findByUserId(user.getId());

        return games.stream()
                .map(game -> buildGameResponse(game, true))
                .collect(Collectors.toList());
    }

    private GameResponse buildGameResponse(Game game, boolean revealCharacter) {
        List<GameResponse.QuestionResponse> conversationHistory = game.getQuestions().stream()
                .map(q -> GameResponse.QuestionResponse.builder()
                        .question(q.getQuestionText())
                        .answer(q.getAnswerText())
                        .askedAt(q.getAskedAt())
                        .build())
                .collect(Collectors.toList());

        return GameResponse.builder()
                .gameId(game.getId())
                .status(game.getStatus())
                .questionsCount(game.getQuestionsCount())
                .startedAt(game.getStartedAt())
                .endedAt(game.getEndedAt())
                .guessedCorrectly(game.getGuessedCorrectly())
                .finalGuess(game.getFinalGuess())
                .revealedCharacter(revealCharacter ? game.getCharacter().getName() + " from " + game.getCharacter().getAnime() : null)
                .conversationHistory(conversationHistory)
                .build();
    }

}

