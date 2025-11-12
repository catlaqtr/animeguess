package com.anime.guessgame.repository;

import com.anime.guessgame.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {

    List<Question> findByGameIdOrderByAskedAtAsc(Long gameId);

    Long countByGameId(Long gameId);

}

