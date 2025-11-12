package com.anime.guessgame.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuestionAnswerResponse {

    private String question;
    private String answer;
    private Integer totalQuestions;

}

