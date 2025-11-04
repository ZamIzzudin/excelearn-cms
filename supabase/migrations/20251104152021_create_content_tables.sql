/*
  # Content Management System Tables

  1. New Tables
    - `statistics`
      - `id` (uuid, primary key)
      - `year_experience` (integer) - Years of experience
      - `total_participant` (integer) - Total participants
      - `total_topic_class` (integer) - Total topic classes
      - `total_training_completed` (integer) - Total training completed
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `partners`
      - `id` (uuid, primary key)
      - `partner_name` (text) - Partner company name
      - `logo_url` (text) - Partner logo URL
      - `logo_public_id` (text) - Cloudinary public ID
      - `is_active` (boolean) - Active status
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `testimonials`
      - `id` (uuid, primary key)
      - `name` (text) - Testimonial author name
      - `title` (text) - Author's title/position
      - `content` (text) - Testimonial content
      - `photo_url` (text, nullable) - Author's photo URL
      - `photo_public_id` (text, nullable) - Cloudinary public ID
      - `is_active` (boolean) - Active status
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `metadata`
      - `id` (uuid, primary key)
      - `site_title` (text) - Website title
      - `site_description` (text) - Meta description
      - `site_keywords` (text[]) - SEO keywords
      - `og_title` (text) - Open Graph title
      - `og_description` (text) - Open Graph description
      - `og_image` (text) - Open Graph image URL
      - `twitter_card` (text) - Twitter card type
      - `twitter_title` (text) - Twitter title
      - `twitter_description` (text) - Twitter description
      - `twitter_image` (text) - Twitter image URL
      - `favicon_url` (text) - Favicon URL
      - `canonical_url` (text) - Canonical URL
      - `robots` (text) - Robots meta tag
      - `author` (text) - Content author
      - `language` (text) - Site language
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage content
*/

-- Create statistics table
CREATE TABLE IF NOT EXISTS statistics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  year_experience integer NOT NULL DEFAULT 0,
  total_participant integer NOT NULL DEFAULT 0,
  total_topic_class integer NOT NULL DEFAULT 0,
  total_training_completed integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE statistics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view statistics"
  ON statistics FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update statistics"
  ON statistics FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can insert statistics"
  ON statistics FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create partners table
CREATE TABLE IF NOT EXISTS partners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_name text NOT NULL,
  logo_url text,
  logo_public_id text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE partners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view partners"
  ON partners FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert partners"
  ON partners FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update partners"
  ON partners FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete partners"
  ON partners FOR DELETE
  TO authenticated
  USING (true);

-- Create testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  photo_url text,
  photo_public_id text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view testimonials"
  ON testimonials FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert testimonials"
  ON testimonials FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update testimonials"
  ON testimonials FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete testimonials"
  ON testimonials FOR DELETE
  TO authenticated
  USING (true);

-- Create metadata table
CREATE TABLE IF NOT EXISTS metadata (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  site_title text DEFAULT '',
  site_description text DEFAULT '',
  site_keywords text[] DEFAULT ARRAY[]::text[],
  og_title text DEFAULT '',
  og_description text DEFAULT '',
  og_image text DEFAULT '',
  twitter_card text DEFAULT 'summary_large_image',
  twitter_title text DEFAULT '',
  twitter_description text DEFAULT '',
  twitter_image text DEFAULT '',
  favicon_url text DEFAULT '',
  canonical_url text DEFAULT '',
  robots text DEFAULT 'index, follow',
  author text DEFAULT '',
  language text DEFAULT 'id',
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE metadata ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view metadata"
  ON metadata FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update metadata"
  ON metadata FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can insert metadata"
  ON metadata FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Insert initial statistics record
INSERT INTO statistics (year_experience, total_participant, total_topic_class, total_training_completed)
VALUES (0, 0, 0, 0)
ON CONFLICT DO NOTHING;

-- Insert initial metadata record
INSERT INTO metadata (site_title, site_description, language)
VALUES ('Excelearn', 'Professional IT Training and Consulting', 'id')
ON CONFLICT DO NOTHING;