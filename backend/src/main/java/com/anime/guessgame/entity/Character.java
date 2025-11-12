package com.anime.guessgame.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "characters")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Character {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Character name is required")
    @Column(nullable = false, length = 100)
    private String name;

    @NotBlank(message = "Anime name is required")
    @Column(nullable = false, length = 200)
    private String anime;

    @Column(length = 20)
    private String gender;

    @Column(length = 50)
    private String age;

    @Column(name = "hair_color", length = 50)
    private String hairColor;

    @Column(name = "eye_color", length = 50)
    private String eyeColor;

    @Column(length = 200)
    private String occupation;

    @Column(columnDefinition = "TEXT")
    private String personality;

    @Column(name = "powers_abilities", columnDefinition = "TEXT")
    private String powersAbilities;

    @Column(columnDefinition = "TEXT")
    private String backstory;

    @Column(name = "notable_quotes", columnDefinition = "TEXT")
    private String notableQuotes;

    @Column(columnDefinition = "TEXT")
    private String relationships;

    @Column(name = "appearance_description", columnDefinition = "TEXT")
    private String appearanceDescription;

    @Column(name = "character_type", length = 50)
    private String characterType; // protagonist, antagonist, supporting

    @Column(name = "is_active")
    @Builder.Default
    private Boolean isActive = true;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "character", cascade = CascadeType.ALL)
    @Builder.Default
    private List<Game> games = new ArrayList<>();

    /**
     * Get full character data for AI context
     */
    public String getFullCharacterData() {
        return String.format("""
            Name: %s
            Anime: %s
            Gender: %s
            Age: %s
            Hair Color: %s
            Eye Color: %s
            Occupation: %s
            Personality: %s
            Powers/Abilities: %s
            Backstory: %s
            Notable Quotes: %s
            Relationships: %s
            Appearance: %s
            Type: %s
            """,
            name,
            anime,
            gender != null ? gender : "Unknown",
            age != null ? age : "Unknown",
            hairColor != null ? hairColor : "Unknown",
            eyeColor != null ? eyeColor : "Unknown",
            occupation != null ? occupation : "Unknown",
            personality != null ? personality : "Unknown",
            powersAbilities != null ? powersAbilities : "Unknown",
            backstory != null ? backstory : "Unknown",
            notableQuotes != null ? notableQuotes : "Unknown",
            relationships != null ? relationships : "Unknown",
            appearanceDescription != null ? appearanceDescription : "Unknown",
            characterType != null ? characterType : "Unknown"
        );
    }

}

