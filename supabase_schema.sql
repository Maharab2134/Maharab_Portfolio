-- ==============================================================================
-- Supabase Schema for Maharab's Portfolio
-- Copy and paste this into your Supabase Dashboard -> SQL Editor and click "Run"
-- ==============================================================================

-- 1. Create Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id TEXT UNIQUE NOT NULL, -- e.g. "e-commerce-hub"
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Full Stack',
  short_desc TEXT NOT NULL,
  full_desc TEXT NOT NULL,
  image_url TEXT NOT NULL,
  technologies TEXT[] DEFAULT '{}',
  features TEXT[] DEFAULT '{}',
  github_url TEXT,
  live_url TEXT,
  featured BOOLEAN DEFAULT false,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Create Profile Info Table
CREATE TABLE IF NOT EXISTS public.profile_info (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL DEFAULT 'Md. Maharab Hosen',
  short_name TEXT NOT NULL DEFAULT 'Md. Maharab',
  title TEXT NOT NULL DEFAULT 'Software Developer',
  tagline TEXT,
  bio TEXT,
  email TEXT,
  phone TEXT,
  location TEXT,
  resume_url TEXT,
  profile_image TEXT,
  show_intro_video BOOLEAN DEFAULT true,
  intro_video_url TEXT,
  typewriter_prefix TEXT DEFAULT 'I engineer',
  typewriter_phrases TEXT[] DEFAULT ARRAY['Scalable Full-Stack Web Apps', 'Cross-Platform Mobile Experiences', 'High-Throughput REST & GraphQL APIs', 'Secure Microservices Architecture'],
  available_for_hire BOOLEAN DEFAULT true,
  years_experience TEXT DEFAULT '2+',
  projects_completed TEXT DEFAULT '50+',
  satisfaction_rate TEXT DEFAULT '100%',
  github_url TEXT,
  linkedin_url TEXT,
  twitter_url TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- In case profile_info already exists, safe column additions:
ALTER TABLE public.profile_info ADD COLUMN IF NOT EXISTS show_intro_video BOOLEAN DEFAULT true;
ALTER TABLE public.profile_info ADD COLUMN IF NOT EXISTS intro_video_url TEXT;
ALTER TABLE public.profile_info ADD COLUMN IF NOT EXISTS typewriter_prefix TEXT DEFAULT 'I engineer';
ALTER TABLE public.profile_info ADD COLUMN IF NOT EXISTS typewriter_phrases TEXT[] DEFAULT ARRAY['Scalable Full-Stack Web Apps', 'Cross-Platform Mobile Experiences', 'High-Throughput REST & GraphQL APIs', 'Secure Microservices Architecture'];

-- 3. Create Contact Messages Table (stores form submissions)
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Create Education Table
CREATE TABLE IF NOT EXISTS public.education (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  degree TEXT NOT NULL,
  institution TEXT NOT NULL,
  period TEXT NOT NULL,
  description TEXT,
  highlights TEXT[] DEFAULT '{}',
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Create Certificates Table
CREATE TABLE IF NOT EXISTS public.certificates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  issuer TEXT NOT NULL,
  year TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'Professional',
  link TEXT,
  details TEXT,
  verification_id TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Create Skill Categories Table
CREATE TABLE IF NOT EXISTS public.skill_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id TEXT UNIQUE NOT NULL,
  label TEXT NOT NULL,
  icon_name TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. Create Skills Table
CREATE TABLE IF NOT EXISTS public.skills (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  skill_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  level TEXT NOT NULL DEFAULT 'Core Production',
  color TEXT NOT NULL DEFAULT '#a855f7',
  icon_name TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ==============================================================================
-- Row Level Security (RLS) Configuration
-- Run this in Supabase SQL Editor to allow your Admin Console to Edit & Save
-- ==============================================================================

-- Option 1: Disable RLS completely for effortless Admin editing (Recommended for personal portfolio):
ALTER TABLE public.projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_info DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.education DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills DISABLE ROW LEVEL SECURITY;

-- Option 2: If you prefer keeping RLS enabled, grant full access to public (both anon & authenticated):
-- DROP POLICY IF EXISTS "Allow admin full access on projects" ON public.projects;
-- DROP POLICY IF EXISTS "Allow public read on projects" ON public.projects;
-- DROP POLICY IF EXISTS "Allow all access on projects" ON public.projects;
-- CREATE POLICY "Allow all access on projects" ON public.projects FOR ALL TO public USING (true) WITH CHECK (true);

-- DROP POLICY IF EXISTS "Allow admin full access on profile_info" ON public.profile_info;
-- DROP POLICY IF EXISTS "Allow public read on profile_info" ON public.profile_info;
-- DROP POLICY IF EXISTS "Allow all access on profile_info" ON public.profile_info;
-- CREATE POLICY "Allow all access on profile_info" ON public.profile_info FOR ALL TO public USING (true) WITH CHECK (true);

-- DROP POLICY IF EXISTS "Allow public insert on contact_messages" ON public.contact_messages;
-- DROP POLICY IF EXISTS "Allow admin read contact_messages" ON public.contact_messages;
-- DROP POLICY IF EXISTS "Allow admin update contact_messages" ON public.contact_messages;
-- DROP POLICY IF EXISTS "Allow admin delete contact_messages" ON public.contact_messages;
-- DROP POLICY IF EXISTS "Allow all access on contact_messages" ON public.contact_messages;
-- CREATE POLICY "Allow all access on contact_messages" ON public.contact_messages FOR ALL TO public USING (true) WITH CHECK (true);

-- ==============================================================================
-- 6. Storage Bucket & RLS Policies for File Uploads (portfolio-assets)
-- Run this in Supabase Dashboard -> SQL Editor to enable direct image & resume uploads!
-- ==============================================================================

-- Create the 'portfolio-assets' bucket if it doesn't exist yet
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-assets', 'portfolio-assets', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Drop older/conflicting policies if any
DROP POLICY IF EXISTS "Allow public all on portfolio-assets" ON storage.objects;
DROP POLICY IF EXISTS "Allow Public All on portfolio-assets" ON storage.objects;
DROP POLICY IF EXISTS "Allow public uploads to portfolio-assets" ON storage.objects;
DROP POLICY IF EXISTS "Allow public select on portfolio-assets" ON storage.objects;
DROP POLICY IF EXISTS "Allow public update on portfolio-assets" ON storage.objects;
DROP POLICY IF EXISTS "Allow public delete on portfolio-assets" ON storage.objects;
DROP POLICY IF EXISTS "Give public access to portfolio-assets" ON storage.objects;

-- Enable Public (Anon) access for upload, download, update, and delete in portfolio-assets
CREATE POLICY "Allow public all on portfolio-assets"
ON storage.objects
FOR ALL
TO public
USING (bucket_id = 'portfolio-assets')
WITH CHECK (bucket_id = 'portfolio-assets');

