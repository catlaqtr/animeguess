package com.anime.guessgame.controller;

import com.anime.guessgame.dto.GameResponse;
import com.anime.guessgame.dto.GuessRequest;
import com.anime.guessgame.dto.QuestionAnswerResponse;
import com.anime.guessgame.dto.QuestionRequest;
import com.anime.guessgame.service.GameService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/game")
@SecurityRequirement(name = "Bearer Authentication")
@Tag(name = "Game", description = "Game management and gameplay endpoints")
public class GameController {

    @Autowired
    private GameService gameService;

    @PostMapping("/start")
    @Operation(summary = "Start a new game", description = "Starts a new game with a random anime character")
    public ResponseEntity<GameResponse> startGame(Authentication authentication) {
        return ResponseEntity.ok(gameService.startNewGame(authentication.getName()));
    }

    @PostMapping("/ask")
    @Operation(summary = "Ask a question", description = "Ask a question about the secret character")
    public ResponseEntity<QuestionAnswerResponse> askQuestion(
            @Valid @RequestBody QuestionRequest request,
            Authentication authentication) {
        return ResponseEntity.ok(gameService.askQuestion(authentication.getName(), request.getQuestion()));
    }

    @PostMapping("/guess")
    @Operation(summary = "Submit a guess", description = "Guess the character's name to end the game")
    public ResponseEntity<GameResponse> submitGuess(
            @Valid @RequestBody GuessRequest request,
            Authentication authentication) {
        return ResponseEntity.ok(gameService.submitGuess(authentication.getName(), request.getCharacterName()));
    }

    @GetMapping("/current")
    @Operation(summary = "Get current game", description = "Retrieves the current active game")
    public ResponseEntity<GameResponse> getCurrentGame(Authentication authentication) {
        return ResponseEntity.ok(gameService.getCurrentGame(authentication.getName()));
    }

    @GetMapping("/history")
    @Operation(summary = "Get game history", description = "Retrieves all games played by the user")
    public ResponseEntity<List<GameResponse>> getGameHistory(Authentication authentication) {
        return ResponseEntity.ok(gameService.getUserGameHistory(authentication.getName()));
    }

}

