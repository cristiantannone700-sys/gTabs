/*
  # Create gTABS Schema

  1. New Tables
    - `songs`
      - `id` (uuid, primary key)
      - `title` (text) - Song title
      - `artist` (text) - Artist name
      - `source` (text) - Tab source (e.g., "Tab Hero")
      - `thumbnail_url` (text, nullable) - Song thumbnail image
      - `difficulty` (text, nullable) - Difficulty level (e.g., "EASY")
      - `created_at` (timestamptz) - Creation timestamp
    
    - `user_library`
      - `id` (uuid, primary key)
      - `user_id` (uuid) - References auth.users
      - `song_id` (uuid) - References songs
      - `created_at` (timestamptz) - When song was added to library
  
  2. Security
    - Enable RLS on both tables
    - Songs are publicly readable
    - User library is private to each user
*/

-- Create songs table
CREATE TABLE IF NOT EXISTS songs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  artist text NOT NULL,
  source text DEFAULT 'Tab Hero',
  thumbnail_url text,
  difficulty text,
  created_at timestamptz DEFAULT now()
);

-- Create user_library table
CREATE TABLE IF NOT EXISTS user_library (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  song_id uuid REFERENCES songs(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, song_id)
);

-- Enable RLS
ALTER TABLE songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_library ENABLE ROW LEVEL SECURITY;

-- Songs policies (public read)
CREATE POLICY "Songs are viewable by everyone"
  ON songs FOR SELECT
  TO authenticated, anon
  USING (true);

-- User library policies
CREATE POLICY "Users can view own library"
  ON user_library FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can add to own library"
  ON user_library FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove from own library"
  ON user_library FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Insert some sample popular songs
INSERT INTO songs (title, artist, source, difficulty, thumbnail_url) VALUES
  ('A Thousand Years', 'Christina Perri', 'Tab Hero', 'EASY', 'https://images.pexels.com/photos/1407322/pexels-photo-1407322.jpeg?auto=compress&cs=tinysrgb&w=200'),
  ('Bohemian Rhapsody', 'Queen', 'Tab Hero', 'EASY', 'https://images.pexels.com/photos/167491/pexels-photo-167491.jpeg?auto=compress&cs=tinysrgb&w=200'),
  ('Can''t Help Falling In Love', 'Elvis Presley', 'Tab Hero', 'EASY', 'https://images.pexels.com/photos/1690351/pexels-photo-1690351.jpeg?auto=compress&cs=tinysrgb&w=200')
ON CONFLICT DO NOTHING;