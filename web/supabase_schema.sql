-- Create an ENUM for Club Pillars
CREATE TYPE club_pillar AS ENUM ('stem', 'art', 'drama', 'sport', 'other');

-- Create Schools Table
CREATE TABLE schools (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  type VARCHAR(50), -- e.g., Public, Private, Charter
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(50),
  zip_code VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Clubs Table
CREATE TABLE clubs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE NOT NULL,
  pillar club_pillar NOT NULL,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(100), -- e.g., Public, Homeschool Co-op, Parent-Led
  age_range VARCHAR(50),
  meeting_time VARCHAR(100),
  members_count INTEGER DEFAULT 0,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Indexes for fast searching and routing
CREATE INDEX idx_schools_slug ON schools(slug);
CREATE INDEX idx_schools_name ON schools(name);
CREATE INDEX idx_clubs_school_id ON clubs(school_id);
CREATE INDEX idx_clubs_pillar ON clubs(pillar);

-- Enable Row Level Security (RLS)
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE clubs ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (everyone can view directories)
CREATE POLICY "Schools are viewable by everyone." ON schools FOR SELECT USING (true);
CREATE POLICY "Clubs are viewable by everyone." ON clubs FOR SELECT USING (true);
