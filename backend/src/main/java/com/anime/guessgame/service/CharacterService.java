package com.anime.guessgame.service;

import com.anime.guessgame.entity.Character;
import com.anime.guessgame.repository.CharacterRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CharacterService {

    private static final Logger logger = LoggerFactory.getLogger(CharacterService.class);

    @Autowired
    private CharacterRepository characterRepository;

    @Transactional(readOnly = true)
    public List<Character> getAllActiveCharacters() {
        logger.info("Fetching all active characters");
        return characterRepository.findByIsActiveTrue();
    }

    @Transactional(readOnly = true)
    public List<Character> getAllCharacters() {
        logger.info("Fetching all characters");
        return characterRepository.findAll();
    }

}

