-- Brainstormer Database Schema

-- Projects Table
CREATE TABLE IF NOT EXISTS projects (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    title text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Collections Table
CREATE TABLE IF NOT EXISTS collections (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Saved Words Table
CREATE TABLE IF NOT EXISTS saved_words (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    collection_id uuid NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
    word text NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

-- Search Sessions Table
CREATE TABLE IF NOT EXISTS search_sessions (
    id uuid PRIMARY KEY,
    project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    user_id uuid NOT NULL,
    query text NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

-- Add RLS policies for search_sessions
ALTER TABLE search_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own search sessions"
    ON search_sessions FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Users can create their own search sessions"
    ON search_sessions FOR INSERT
    WITH CHECK (user_id = auth.uid()); 