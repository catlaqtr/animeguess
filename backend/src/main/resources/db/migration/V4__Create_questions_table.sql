-- Create questions table (conversation history)
CREATE TABLE questions (
    id BIGSERIAL PRIMARY KEY,
    game_id BIGINT NOT NULL,
    question_text TEXT NOT NULL,
    answer_text TEXT NOT NULL,
    asked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_questions_game FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE
);

-- Create indexes
CREATE INDEX idx_questions_game_id ON questions(game_id);
CREATE INDEX idx_questions_asked_at ON questions(asked_at);

