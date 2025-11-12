-- Create games table
CREATE TABLE games (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    character_id BIGINT NOT NULL,
    status VARCHAR(20) NOT NULL, -- ACTIVE, WON, LOST
    questions_count INT DEFAULT 0,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMP,
    guessed_correctly BOOLEAN DEFAULT FALSE,
    final_guess VARCHAR(100),
    
    CONSTRAINT fk_games_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_games_character FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE
);

-- Create indexes
CREATE INDEX idx_games_user_id ON games(user_id);
CREATE INDEX idx_games_status ON games(status);
CREATE INDEX idx_games_started_at ON games(started_at);

