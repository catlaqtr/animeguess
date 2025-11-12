package com.anime.guessgame.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GuessRequest {

    @NotBlank(message = "Guess is required")
    private String characterName;

}

