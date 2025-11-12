package com.anime.guessgame.dto;

import com.anime.guessgame.entity.Game.GameStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GameResponse {

    private Long gameId;
    private GameStatus status;
    private Integer questionsCount;
    private LocalDateTime startedAt;
    private LocalDateTime endedAt;
    private Boolean guessedCorrectly;
    private String finalGuess;
    private String revealedCharacter;
    private List<QuestionResponse> conversationHistory;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class QuestionResponse {
        private String question;
        private String answer;
        private LocalDateTime askedAt;
    }

}

