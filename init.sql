-- Connect to the database (Implicitly handled by docker-entrypoint)

-- 1. Users Table (Linked to Asgardeo sub_id)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    sub_id VARCHAR(255) UNIQUE NOT NULL, -- Asgardeo Subject ID
    email VARCHAR(255),
    role VARCHAR(50) DEFAULT 'recruiter', -- recruiter | admin
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Sessions Table
CREATE TABLE IF NOT EXISTS sessions (
    id SERIAL PRIMARY KEY,
    recruiter_id INTEGER REFERENCES users(id),
    candidate_name VARCHAR(255),
    start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP,
    status VARCHAR(50) DEFAULT 'active' -- active | completed
);

-- 3. Transcripts Table
CREATE TABLE IF NOT EXISTS transcripts (
    id SERIAL PRIMARY KEY,
    session_id INTEGER REFERENCES sessions(id),
    original_text TEXT, -- Ideally Encrypted in App Layer
    sanitized_text TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. RedactionLogs Table
CREATE TABLE IF NOT EXISTS redaction_logs (
    id SERIAL PRIMARY KEY,
    transcript_id INTEGER REFERENCES transcripts(id),
    entity_type VARCHAR(50), -- ORG, LOC, PER
    original_value VARCHAR(255),
    confidence_score FLOAT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. XAIFeedback Table
CREATE TABLE IF NOT EXISTS xai_feedback (
    id SERIAL PRIMARY KEY,
    session_id INTEGER REFERENCES sessions(id),
    analysis_json JSONB,
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
