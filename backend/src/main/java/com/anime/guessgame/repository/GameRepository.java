package com.anime.guessgame.repository;

import com.anime.guessgame.entity.Game;
import com.anime.guessgame.entity.Game.GameStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GameRepository extends JpaRepository<Game, Long> {

    List<Game> findByUserId(Long userId);

    List<Game> findByUserIdAndStatus(Long userId, GameStatus status);

    @Query("SELECT g FROM Game g WHERE g.user.id = :userId AND g.status = 'ACTIVE' ORDER BY g.startedAt DESC")
    Optional<Game> findActiveGameByUserId(@Param("userId") Long userId);

    @Query("SELECT g FROM Game g LEFT JOIN FETCH g.questions WHERE g.id = :gameId")
    Optional<Game> findByIdWithQuestions(@Param("gameId") Long gameId);

}

