-- Create characters table
CREATE TABLE characters (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    anime VARCHAR(200) NOT NULL,
    gender VARCHAR(20),
    age VARCHAR(50),
    hair_color VARCHAR(50),
    eye_color VARCHAR(50),
    occupation VARCHAR(200),
    personality TEXT,
    powers_abilities TEXT,
    backstory TEXT,
    notable_quotes TEXT,
    relationships TEXT,
    appearance_description TEXT,
    character_type VARCHAR(50), -- protagonist, antagonist, supporting
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_characters_name ON characters(name);
CREATE INDEX idx_characters_anime ON characters(anime);
CREATE INDEX idx_characters_active ON characters(is_active);

