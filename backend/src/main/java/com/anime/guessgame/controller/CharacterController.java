package com.anime.guessgame.controller;

import com.anime.guessgame.entity.Character;
import com.anime.guessgame.service.CharacterService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/characters")
@Tag(name = "Characters", description = "Character information endpoints")
public class CharacterController {

    @Autowired
    private CharacterService characterService;

    @GetMapping("/all")
    @Operation(summary = "Get all characters", description = "Retrieves all active anime characters (public endpoint)")
    public ResponseEntity<List<Character>> getAllCharacters() {
        return ResponseEntity.ok(characterService.getAllActiveCharacters());
    }

    @GetMapping("/admin/all")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Get all characters including inactive", description = "Admin endpoint to get all characters")
    public ResponseEntity<List<Character>> getAllCharactersIncludingInactive() {
        return ResponseEntity.ok(characterService.getAllCharacters());
    }

}

