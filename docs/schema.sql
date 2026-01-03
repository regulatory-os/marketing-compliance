-- ============================================
-- Marketing Compliance - Optional SQL Schema
-- ============================================
-- This schema is provided as a REFERENCE for those who want to extend
-- the standalone version with database persistence (e.g., Supabase, PostgreSQL).
-- The standalone version does NOT require any database.
-- ============================================

-- Analysis Results Table
-- Stores the results of compliance analyses
CREATE TABLE IF NOT EXISTS analysis_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    content_type VARCHAR(50) DEFAULT 'general',
    score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
    issues_count INTEGER NOT NULL DEFAULT 0,
    critical_count INTEGER NOT NULL DEFAULT 0,
    high_count INTEGER NOT NULL DEFAULT 0,
    medium_count INTEGER NOT NULL DEFAULT 0,
    low_count INTEGER NOT NULL DEFAULT 0,
    info_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analysis Issues Table
-- Stores individual issues found during analysis
CREATE TABLE IF NOT EXISTS analysis_issues (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    analysis_id UUID REFERENCES analysis_results(id) ON DELETE CASCADE,
    category VARCHAR(50) NOT NULL,
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('critical', 'high', 'medium', 'low', 'info')),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    matched_text TEXT NOT NULL,
    position_start INTEGER NOT NULL,
    position_end INTEGER NOT NULL,
    suggestion TEXT,
    regulation VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Custom Rules Table (Optional)
-- Allows users to define their own compliance rules
CREATE TABLE IF NOT EXISTS custom_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    category VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('critical', 'high', 'medium', 'low', 'info')),
    patterns TEXT[] NOT NULL, -- Array of regex patterns
    suggestion TEXT,
    regulation VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_analysis_results_user_id ON analysis_results(user_id);
CREATE INDEX IF NOT EXISTS idx_analysis_results_created_at ON analysis_results(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analysis_results_score ON analysis_results(score);
CREATE INDEX IF NOT EXISTS idx_analysis_issues_analysis_id ON analysis_issues(analysis_id);
CREATE INDEX IF NOT EXISTS idx_analysis_issues_severity ON analysis_issues(severity);
CREATE INDEX IF NOT EXISTS idx_analysis_issues_category ON analysis_issues(category);
CREATE INDEX IF NOT EXISTS idx_custom_rules_user_id ON custom_rules(user_id);

-- Row Level Security (RLS) Policies for Supabase
-- Enable RLS
ALTER TABLE analysis_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE analysis_issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_rules ENABLE ROW LEVEL SECURITY;

-- Users can only see their own analysis results
CREATE POLICY "Users can view own analysis results"
    ON analysis_results FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own analysis results"
    ON analysis_results FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own analysis results"
    ON analysis_results FOR DELETE
    USING (auth.uid() = user_id);

-- Users can only see issues from their own analyses
CREATE POLICY "Users can view own analysis issues"
    ON analysis_issues FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM analysis_results
            WHERE analysis_results.id = analysis_issues.analysis_id
            AND analysis_results.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert own analysis issues"
    ON analysis_issues FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM analysis_results
            WHERE analysis_results.id = analysis_issues.analysis_id
            AND analysis_results.user_id = auth.uid()
        )
    );

-- Users can only manage their own custom rules
CREATE POLICY "Users can view own custom rules"
    ON custom_rules FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own custom rules"
    ON custom_rules FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own custom rules"
    ON custom_rules FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own custom rules"
    ON custom_rules FOR DELETE
    USING (auth.uid() = user_id);

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_analysis_results_updated_at
    BEFORE UPDATE ON analysis_results
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_custom_rules_updated_at
    BEFORE UPDATE ON custom_rules
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Sample Queries
-- ============================================

-- Get all analyses for a user with issue counts
-- SELECT
--     ar.*,
--     COUNT(ai.id) as total_issues
-- FROM analysis_results ar
-- LEFT JOIN analysis_issues ai ON ar.id = ai.analysis_id
-- WHERE ar.user_id = 'your-user-id'
-- GROUP BY ar.id
-- ORDER BY ar.created_at DESC;

-- Get compliance score trend over time
-- SELECT
--     DATE_TRUNC('day', created_at) as date,
--     AVG(score) as avg_score,
--     COUNT(*) as analysis_count
-- FROM analysis_results
-- WHERE user_id = 'your-user-id'
-- GROUP BY DATE_TRUNC('day', created_at)
-- ORDER BY date DESC;

-- Get most common issues
-- SELECT
--     category,
--     title,
--     COUNT(*) as occurrence_count
-- FROM analysis_issues ai
-- JOIN analysis_results ar ON ai.analysis_id = ar.id
-- WHERE ar.user_id = 'your-user-id'
-- GROUP BY category, title
-- ORDER BY occurrence_count DESC
-- LIMIT 10;
