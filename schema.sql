-- Supabase Schema for Disha

-- Students Table
CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone_number VARCHAR(20) UNIQUE NOT NULL,
  full_name VARCHAR(100),
  college_name VARCHAR(200),
  branch VARCHAR(100),
  current_year INTEGER,
  home_district VARCHAR(100),
  family_income_bracket VARCHAR(50),
  caste_category VARCHAR(20),
  fee_payment_status VARCHAR(20),
  language_preference VARCHAR(20) DEFAULT 'English',
  onboarding_step INTEGER DEFAULT 0,
  onboarding_complete BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Conversations Table
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  direction VARCHAR(10) NOT NULL, -- 'inbound' or 'outbound'
  message_text TEXT NOT NULL,
  agent_used VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Engagement Logs
CREATE TABLE engagement_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  messages_sent INTEGER DEFAULT 0,
  messages_received INTEGER DEFAULT 0,
  risk_score INTEGER DEFAULT 0,
  UNIQUE(student_id, date)
);

-- Risk Flags
CREATE TABLE risk_flags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  severity VARCHAR(20) NOT NULL, -- 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'
  reason TEXT NOT NULL,
  resolved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Nudge History
CREATE TABLE nudge_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  nudge_type VARCHAR(50) NOT NULL,
  content TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'sent',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Scholarships Table
CREATE TABLE scholarships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(200) NOT NULL,
  amount_max INTEGER,
  deadline DATE,
  eligibility_income_max INTEGER,
  eligibility_categories TEXT[], -- Array of strings like ['SC', 'ST']
  description TEXT,
  application_link TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Walk State (for step-by-step Walker Agent)
CREATE TABLE walk_state (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  flow_name VARCHAR(100) NOT NULL,
  current_step INTEGER DEFAULT 0,
  context_data JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN DEFAULT true,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Update timestamp function
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_timestamp_students
BEFORE UPDATE ON students
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp_walk_state
BEFORE UPDATE ON walk_state
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();
