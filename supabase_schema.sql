-- ==============================================================================
-- Complete Supabase Schema for Maharab's Portfolio
-- Copy and paste this into your Supabase Dashboard -> SQL Editor and click "Run"
-- ==============================================================================

-- 1. Create Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id TEXT UNIQUE NOT NULL,
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
  footer_bio TEXT,
  maps_url TEXT,
  experience_config JSONB DEFAULT '{"isActive": true, "showCurrentOnly": false, "enableHighlights": true}'::jsonb,
  development_process JSONB,
  working_hours JSONB,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Safe column additions in case profile_info already exists
ALTER TABLE public.profile_info ADD COLUMN IF NOT EXISTS show_intro_video BOOLEAN DEFAULT true;
ALTER TABLE public.profile_info ADD COLUMN IF NOT EXISTS intro_video_url TEXT;
ALTER TABLE public.profile_info ADD COLUMN IF NOT EXISTS typewriter_prefix TEXT DEFAULT 'I engineer';
ALTER TABLE public.profile_info ADD COLUMN IF NOT EXISTS typewriter_phrases TEXT[] DEFAULT ARRAY['Scalable Full-Stack Web Apps', 'Cross-Platform Mobile Experiences', 'High-Throughput REST & GraphQL APIs', 'Secure Microservices Architecture'];
ALTER TABLE public.profile_info ADD COLUMN IF NOT EXISTS footer_bio TEXT;
ALTER TABLE public.profile_info ADD COLUMN IF NOT EXISTS maps_url TEXT;
ALTER TABLE public.profile_info ADD COLUMN IF NOT EXISTS experience_config JSONB DEFAULT '{"isActive": true, "showCurrentOnly": false, "enableHighlights": true}'::jsonb;
ALTER TABLE public.profile_info ADD COLUMN IF NOT EXISTS development_process JSONB;
ALTER TABLE public.profile_info ADD COLUMN IF NOT EXISTS working_hours JSONB;
ALTER TABLE public.profile_info ADD COLUMN IF NOT EXISTS about_stats JSONB DEFAULT '[{"value": "2+ Years", "label": "Project Experience"}, {"value": "20+", "label": "Projects"}, {"value": "10+", "label": "Technologies"}, {"value": "CSE", "label": "Academic Background"}]'::jsonb;

-- 3. Create Contact Messages Table
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Create Project Reviews Table
CREATE TABLE IF NOT EXISTS public.project_reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  gender TEXT DEFAULT 'unspecified',
  rating INTEGER DEFAULT 5,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  likes INTEGER DEFAULT 0
);

-- 5. Create Education Table
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

-- 6. Create Certificates Table
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

-- 7. Create Skill Categories Table
CREATE TABLE IF NOT EXISTS public.skill_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id TEXT UNIQUE NOT NULL,
  label TEXT NOT NULL,
  icon_name TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 8. Create Skills Table
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

-- 9. Create Experience Table (Required for live experience management)
CREATE TABLE IF NOT EXISTS public.experience (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  role TEXT NOT NULL,
  company TEXT NOT NULL,
  company_url TEXT,
  company_logo TEXT,
  location TEXT,
  period TEXT NOT NULL,
  employment_type TEXT,
  description TEXT,
  technologies TEXT[] DEFAULT '{}',
  highlights TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 10. Create Visitor Analytics Table
CREATE TABLE IF NOT EXISTS public.portfolio_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  visitor_id TEXT NOT NULL,
  session_id TEXT NOT NULL,
  is_new_visitor BOOLEAN DEFAULT true,
  country TEXT DEFAULT 'Unknown',
  city TEXT DEFAULT 'Unknown',
  device TEXT DEFAULT 'Desktop',
  browser TEXT DEFAULT 'Other',
  os TEXT DEFAULT 'Other',
  referrer TEXT DEFAULT 'Direct',
  page_path TEXT NOT NULL DEFAULT 'home',
  section TEXT DEFAULT 'hero',
  duration_seconds INTEGER DEFAULT 10,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON public.portfolio_analytics(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_visitor_id ON public.portfolio_analytics(visitor_id);
CREATE INDEX IF NOT EXISTS idx_analytics_page_path ON public.portfolio_analytics(page_path);

-- ==============================================================================
-- Permissions: Disable RLS for smooth Admin Studio CRUD Operations
-- ==============================================================================
ALTER TABLE public.projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_info DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_reviews DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.education DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.experience DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_analytics DISABLE ROW LEVEL SECURITY;

-- Storage Bucket & Public Upload Policies
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-assets', 'portfolio-assets', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Allow public all on portfolio-assets" ON storage.objects;
CREATE POLICY "Allow public all on portfolio-assets"
ON storage.objects
FOR ALL
TO public
USING (bucket_id = 'portfolio-assets')
WITH CHECK (bucket_id = 'portfolio-assets');

-- ==============================================================================
-- Initial Production Seed Data (Ensures no empty / fallback states)
-- ==============================================================================

-- Seed Skill Categories
INSERT INTO public.skill_categories (category_id, label, icon_name, order_index)
VALUES
  ('frontend', 'Frontend & UI Engineering', 'FaReact', 0),
  ('mobile', 'Mobile App Development', 'SiFlutter', 1),
  ('backend', 'Backend, APIs & Cloud', 'FaServer', 2),
  ('database', 'Databases & ORMs', 'FaDatabase', 3),
  ('tools', 'DevOps, Tools & Architecture', 'FaTools', 4)
ON CONFLICT (category_id) DO NOTHING;

-- Seed Skills
INSERT INTO public.skills (skill_id, name, category, level, color, icon_name, order_index)
VALUES
  ('react', 'React.js', 'frontend', 'Core Production', '#61dafb', 'FaReact', 0),
  ('nextjs', 'Next.js', 'frontend', 'Advanced', '#ffffff', 'SiNextdotjs', 1),
  ('typescript', 'TypeScript', 'frontend', 'Advanced', '#3178c6', 'SiTypescript', 2),
  ('tailwind', 'Tailwind CSS', 'frontend', 'Expert', '#38bdf8', 'SiTailwindcss', 3),
  ('flutter', 'Flutter', 'mobile', 'Core Production', '#02569B', 'SiFlutter', 4),
  ('dart', 'Dart', 'mobile', 'Advanced', '#0175C2', 'SiDart', 5),
  ('nodejs', 'Node.js', 'backend', 'Advanced', '#339933', 'FaNodeJs', 6),
  ('express', 'Express.js', 'backend', 'Core Production', '#ffffff', 'SiExpress', 7),
  ('python', 'Python', 'backend', 'Advanced', '#3776ab', 'FaPython', 8),
  ('fastapi', 'FastAPI', 'backend', 'Core Production', '#009688', 'SiFastapi', 9),
  ('postgresql', 'PostgreSQL', 'database', 'Advanced', '#336791', 'SiPostgresql', 10),
  ('mongodb', 'MongoDB', 'database', 'Advanced', '#47a248', 'SiMongodb', 11),
  ('supabase', 'Supabase', 'database', 'Core Production', '#3ecf8e', 'SiSupabase', 12),
  ('firebase', 'Firebase', 'database', 'Core Production', '#ffca28', 'SiFirebase', 13),
  ('docker', 'Docker', 'tools', 'Intermediate', '#2496ed', 'FaDocker', 14),
  ('git', 'Git & GitHub', 'tools', 'Expert', '#f05032', 'FaGitAlt', 15)
ON CONFLICT (skill_id) DO NOTHING;

-- Seed Experience
INSERT INTO public.experience (role, company, company_url, company_logo, location, period, employment_type, description, technologies, highlights, is_active, order_index)
SELECT
  'Full-Stack Developer & Software Engineer',
  'Freelance & Independent Projects',
  'https://dev-maharab.netlify.app',
  '',
  'Dhaka, Bangladesh (Remote)',
  '2022 - Present',
  'Full-time / Contract',
  'Architecting and developing full-stack web applications, cross-platform Flutter mobile applications, high-throughput REST APIs, and embedded IoT systems with modern cloud infrastructure.',
  ARRAY['React', 'Next.js', 'Flutter', 'Dart', 'TypeScript', 'Node.js', 'Python', 'Supabase', 'PostgreSQL'],
  ARRAY['Shipped 18+ production projects across mobile, full-stack web, AI/ML, and IoT hardware', 'Engineered secure auth suites, real-time messaging, and low-latency database schemas'],
  true,
  0
WHERE NOT EXISTS (SELECT 1 FROM public.experience LIMIT 1);

-- Seed Profile Info
INSERT INTO public.profile_info (
  name, short_name, title, tagline, bio, email, phone, location, resume_url,
  years_experience, projects_completed, satisfaction_rate, github_url, linkedin_url,
  experience_config, development_process, working_hours
)
SELECT
  'Md. Maharab Hosen',
  'Md. Maharab',
  'Full-Stack Software Engineer & Mobile Developer',
  'Transforming ideas into high-performance web, mobile & cloud solutions',
  'Full-Stack Software Engineer and Mobile Developer specializing in React, Next.js, Node.js, TypeScript, and Flutter. Passionate about building robust, scalable applications with clean architecture and delightful user experiences.',
  'maharab442@gmail.com',
  '+8801586282609',
  'Dhaka, Bangladesh',
  'https://zcmeryxyifkxbxkmgvfe.supabase.co/storage/v1/object/public/portfolio-assets/resumes/1789574809090_xhb481.pdf',
  '2+',
  '18+',
  '100%',
  'https://github.com/Maharab2134',
  'https://www.linkedin.com/in/md-maharab-hosen-00a40a2bb/',
  '{"isActive": true, "showCurrentOnly": false, "enableHighlights": true}'::jsonb,
  '{"enabled": true, "title": "Engineering Workflow", "subtitle": "From concept to production"}'::jsonb,
  '{"enabled": true, "startHour": 9, "endHour": 22, "timezone": "Asia/Dhaka", "onlineLabel": "Available for Work"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM public.profile_info LIMIT 1);
