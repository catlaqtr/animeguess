package com.anime.guessgame.repository;

import com.anime.guessgame.entity.Character;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CharacterRepository extends JpaRepository<Character, Long> {

    List<Character> findByIsActiveTrue();

    Optional<Character> findByName(String name);

    List<Character> findByAnime(String anime);

    @Query(value = "SELECT * FROM characters WHERE is_active = true ORDER BY RANDOM() LIMIT 1", nativeQuery = true)
    Optional<Character> findRandomActiveCharacter();

}

