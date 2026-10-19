<div align="center">

# 🚀 Md. Maharab Hosen — Full-Stack Portfolio & Admin CMS

**A state-of-the-art, dynamic portfolio and Content Management System built with React 19, TypeScript, Tailwind CSS, Supabase, and Framer Motion.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-dev--maharab.netlify.app-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)](https://dev-maharab.netlify.app/)
[![React 19](https://img.shields.io/badge/React-19.1.1-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3.3-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Database%20%26%20Storage-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

[🌐 View Live Site](https://dev-maharab.netlify.app/) • [⚡ Admin Studio](https://dev-maharab.netlify.app/admin) • [💼 Hire Me](https://dev-maharab.netlify.app/hire) • [🛣️ Journey](https://dev-maharab.netlify.app/journey)

</div>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Project Architecture & Directory Structure](#-project-architecture--directory-structure)
- [Getting Started & Local Setup](#-getting-started--local-setup)
- [Environment Configuration](#-environment-configuration)
- [Supabase Database & Storage Setup](#-supabase-database--storage-setup)
- [Admin Studio CMS Guide](#-admin-studio-cms-guide)
- [Available Scripts](#-available-scripts)
- [Deployment](#-deployment)
- [Data Integrity & Contribution Guidelines](#-data-integrity--contribution-guidelines)
- [Contact & Connect](#-contact--connect)

---

## 🌟 Overview

This repository powers the official personal portfolio and engineering showcase of **Md. Maharab Hosen** (Full-Stack Software Engineer & Mobile Developer). 

Unlike static portfolio templates, this application is a **living, serverless web platform** backed by **Supabase PostgreSQL & Cloud Storage**. It features a comprehensive **in-app Admin Studio CMS** allowing real-time edits to profile data, projects, experience, education, skills, and credentials without requiring code redeployments. It also includes an embedded **AI Chatbot** with dynamic knowledge synchronization and automated **SEO XML sitemap generation**.

---

## ✨ Key Features

### 🎨 1. Interactive Portfolio Showcase
- **Hero & Dynamic Typewriter**: Dynamic engineering titles, quick statistics (projects completed, years of experience, satisfaction rate), and interactive resume access.
- **Project Catalog & Case Studies**: Categorized showcase (Full Stack, Mobile, Frontend, Backend) with live previews, GitHub links, technology chips, and dedicated deep-dive case studies (`/projects/:id`).
- **Interactive Layout Switching**: Toggle seamlessly between grid cards and list layouts.
- **Skills Matrix & Verified Certificates**: Granular categorization (Foundational, Proficient, Advanced) with direct credential verification links and soft-toggle visibility.
- **Work Experience & Education**: Chronological career milestones and academic history loaded dynamically from Supabase.
- **Development Lifecycle**: Step-by-step visual interactive breakdown of the software development and engineering process.
- **Client Reviews & Testimonials**: Dynamic star ratings, testimonials carousel, and submission reviews.

### 🛡️ 2. Dynamic Admin Studio CMS (`/admin`)
- **Secure Authentication**: Supabase Auth integration paired with a developer quick-login mode for local testing.
- **Live Content Editing**: Full CRUD interfaces for Profile Info, Projects, Experience, Education, Skills, and Certificates.
- **Supabase Cloud Storage Integration**: Direct asset uploads for profile avatars, project thumbnails, and resume PDFs with automatic fallback to local preview.
- **Analytics & Health Dashboard**: Overview of system status, database connection health, visitor statistics, and unread inquiries.
- **Messages & Hire Inquiries**: Direct inbox to review incoming contact form submissions and hire requests.
- **Setup & Diagnostics Tab**: Built-in SQL schema viewer, RLS diagnosis banner, and table health monitors.

### 🤖 3. Intelligent AI Chatbot Assistant
- **Floating Interactive Widget**: Ambient animated chat bubble with unread message badge and live online status indicator.
- **Dynamic Knowledge Sync**: Reads profile information, projects, and skills directly from Supabase to provide accurate answers about Maharab's background and availability.
- **Interactive Action Chips**: Pre-composed quick prompts for fast recruiter and client interactions.
- **Sound Effects & Markdown Formatting**: Audio feedback for message interactions and clean markdown typography.

### 📬 4. Client Inquiries & "Hire Me" Workflow (`/hire`)
- **Service Estimator**: Interactive project scope and budget planner for prospective clients.
- **Serverless Form Delivery**: Contact and hire forms delivered directly to email via **EmailJS** without requiring an independent Express backend.

### 🌐 5. Global Accessibility & Internationalization
- **Multi-Language Selector**: Integrated Google Translate engine supporting instant dynamic translation.
- **Responsive & Ambient Design**: Tailored for all viewports from mobile to ultra-wide displays with modern glassmorphism and Framer Motion micro-interactions.
- **Mobile Bottom Navigation**: Native app-like floating navigation bar on handheld screens.

### 🚀 6. Automated SEO & Sitemap Generation
- **Dynamic Sitemap Script** (`scripts/generate-sitemap.js`): Automatically queries both static route definitions and active Supabase project records to generate an up-to-date `sitemap.xml` prior to production build.
- **JSON-LD Schema**: Structured Schema.org microdata embedded for high search engine visibility and AI agent discovery.

---

## 🛠️ Tech Stack

| Domain | Technology | Description |
| :--- | :--- | :--- |
| **Frontend Framework** | [React 19](https://react.dev/) | Core UI rendering with React 19 concurrent features |
| **Language** | [TypeScript](https://www.typescriptlang.org/) | Type-safe enterprise architecture |
| **Styling** | [Tailwind CSS 3](https://tailwindcss.com/) | Utility-first styling with custom dark theme palette |
| **Animations** | [Framer Motion](https://www.framer.com/motion/) | Smooth layout transitions, modal reveals, and scroll effects |
| **Routing** | [React Router 7](https://reactrouter.com/) | Client-side routing with hash and query param support |
| **Database & Auth** | [Supabase](https://supabase.com/) | Hosted PostgreSQL, Row-Level Security, Storage, and Auth |
| **Email Delivery** | [EmailJS](https://www.emailjs.com/) | Direct client-to-inbox messaging without custom mail server |
| **Icons & Typography** | [React Icons](https://react-icons.github.io/react-icons/) & Heroicons | Modern iconography and Google Fonts |
| **Hosting & CI/CD** | [Netlify](https://www.netlify.com/) | Continuous automated deployment with CDN & security headers |

---

## 📂 Project Architecture & Directory Structure

```text
Maharab_Portfolio/
├── .env.example                # Template for environment credentials
├── netlify.toml                # Netlify deployment, redirect rules & headers
├── package.json                # Project dependencies, build scripts & metadata
├── supabase_schema.sql         # Complete PostgreSQL schema & table setup script
├── tailwind.config.js          # Tailwind CSS theme & plugin configurations
├── tsconfig.json               # TypeScript compiler rules
├── public/
│   ├── index.html              # HTML shell with meta tags & Schema.org JSON-LD
│   ├── manifest.json           # PWA web manifest
│   ├── robots.txt              # Search engine crawler policies
│   └── sitemap.xml             # Auto-generated dynamic XML sitemap
├── scripts/
│   └── generate-sitemap.js     # Node script to build sitemap from code & Supabase
└── src/
    ├── App.tsx                 # Main application component & section registry
    ├── index.tsx               # Application root mounting & providers
    ├── index.css               # Global CSS, scrollbar styles, and animations
    ├── components/             # Reusable UI sections & components
    │   ├── About.tsx           # Biography and personal overview
    │   ├── Certificates.tsx    # Verified certificates with modal inspection
    │   ├── Chatbot.tsx         # AI Assistant widget with status dot
    │   ├── Contact.tsx         # Contact form backed by EmailJS & Supabase
    │   ├── DevelopmentProcess.tsx # Visual engineering workflow stages
    │   ├── Education.tsx       # Degrees and academic credentials
    │   ├── Experience.tsx      # Professional work history
    │   ├── Footer.tsx          # Site footer & social links
    │   ├── Hero.tsx            # Landing banner with dynamic metrics
    │   ├── LanguageSelector.tsx# Multi-language translation dropdown
    │   ├── MobileBottomNav.tsx # Mobile floating navigation bar
    │   ├── Navbar.tsx          # Desktop navigation & quick actions
    │   ├── ProjectReviews.tsx  # Interactive project rating and feedback
    │   ├── Projects.tsx        # Projects grid/list showcase
    │   ├── Skills.tsx          # Skills categorized by proficiency
    │   ├── SmartScrollButton.tsx # Dynamic back-to-top floating button
    │   ├── SplashScreen.tsx    # Initial loading animation
    │   ├── Testimonials.tsx    # Client testimonials carousel
    │   ├── admin/              # Dynamic Admin Studio components
    │   │   ├── AdminHeader.tsx # Studio top bar with status monitors
    │   │   ├── AdminLogin.tsx  # Authentication modal & bypass
    │   │   ├── AdminSidebar.tsx# Tabbed CMS navigation
    │   │   └── tabs/           # Modular CMS editors (Projects, Profile, Skills, etc.)
    │   └── analytics/          # User interaction tracking
    ├── context/                # React context providers
    ├── data/                   # Default static fallbacks & project data
    ├── lib/                    # Supabase client & service helpers
    ├── pages/                  # Top-level standalone route views
    │   ├── Admin.tsx           # Admin Studio CMS Dashboard
    │   ├── CaseStudies.tsx     # In-depth case study repository
    │   ├── Hire.tsx            # Freelance & full-time inquiry workflow
    │   ├── MyJourney.tsx       # Timeline of personal and professional journey
    │   └── ProjectDetails.tsx  # Standalone project detail inspection
    └── types/                  # Shared TypeScript models & interfaces
```

---

## 🚀 Getting Started & Local Setup

### Prerequisites

Ensure you have the following installed on your local environment:
- [Node.js](https://nodejs.org/) (Version 18.x or higher recommended)
- [npm](https://www.npmjs.com/) (Version 9.x or higher)
- [Git](https://git-scm.com/)

### 1. Clone the Repository
```bash
git clone https://github.com/Maharab2134/Maharab_Portfolio.git
cd Maharab_Portfolio
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy the `.env.example` file to create a local `.env` file:
```bash
cp .env.example .env
```
Fill in your Supabase credentials (see [Environment Configuration](#-environment-configuration)).

### 4. Start Development Server
```bash
npm start
# or
npm run dev
```
Open your browser and navigate to **`http://localhost:3000`**.

---

## 🔑 Environment Configuration

Create a `.env` file in the project root with the following variables:

```env
# Supabase Configuration (Find in: Supabase Dashboard -> Project Settings -> API)
REACT_APP_SUPABASE_URL=https://your-project-id.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-supabase-anon-key-here

# Optional: Disable source maps in production to optimize build size
GENERATE_SOURCEMAP=false

# Developer Bypass for Admin Studio (Set to 'true' for local testing without email auth)
REACT_APP_ENABLE_DEV_LOGIN=true

# Optional: EmailJS credentials (if using custom EmailJS keys)
# REACT_APP_EMAILJS_SERVICE_ID=your_service_id
# REACT_APP_EMAILJS_TEMPLATE_ID=your_template_id
# REACT_APP_EMAILJS_PUBLIC_KEY=your_public_key
```

> **Security Note:** Never commit your production `.env` file containing sensitive credentials to Git. Keep `.env` listed in `.gitignore`.

---

## 🗄️ Supabase Database & Storage Setup

The application features full backward compatibility and local fallbacks, but connecting Supabase unlocks real-time CMS sync.

### 1. Execute SQL Schema
1. Open your [Supabase Dashboard](https://supabase.com/dashboard).
2. Go to the **SQL Editor** tab.
3. Open [`supabase_schema.sql`](./supabase_schema.sql) from this repository.
4. Paste the contents into the SQL Editor and click **Run**.
5. This automatically provisions the following tables with safe defaults:
   - `projects`
   - `profile_info`
   - `education`
   - `experience`
   - `skills`
   - `certificates`
   - `messages`
   - `testimonials`

### 2. Configure Cloud Storage
1. In your Supabase Dashboard, go to **Storage**.
2. Create a new public bucket named: `portfolio-assets`.
3. Set the bucket to **Public** to enable image and resume PDF delivery.
4. Ensure public Read access policies are enabled so portfolio visitors can view uploaded images.

---

## ⚡ Admin Studio CMS Guide

To access the administrative Content Management System:
1. Navigate to **`/admin`** (e.g. `http://localhost:3000/admin` or `https://dev-maharab.netlify.app/admin`).
2. Log in using your registered Supabase administrator credentials.
   - *Local Development Tip:* If `REACT_APP_ENABLE_DEV_LOGIN=true` is set, you can use the **"Dev Quick Login"** button for instant sandbox access.
3. Manage your content across dedicated tabs:
   - **Overview:** Database health, visitor counters, quick actions.
   - **Profile:** Bio, job title, social links, resume upload, live metrics.
   - **Projects:** Add/edit projects, set featured status, change display order, upload thumbnails.
   - **Skills & Certificates:** Manage categories, proficiency levels, and credential verification URLs.
   - **Experience & Education:** Update career timeline and degrees.
   - **Chatbot Q&A:** Train and update chatbot knowledge responses.
   - **Messages:** View incoming client submissions in real-time.

---

## 📜 Available Scripts

In the project directory, you can run:

| Command | Action |
| :--- | :--- |
| `npm start` / `npm run dev` | Runs the app in development mode at `http://localhost:3000` |
| `npm run sitemap` | Regenerates `public/sitemap.xml` by fetching live routes and Supabase projects |
| `npm run prebuild` | Automated step running before production build to refresh `sitemap.xml` |
| `npm run build` | Compiles an optimized, minified production build inside the `build/` directory |
| `npm test` | Launches the interactive Jest test runner |

---

## 🌐 Deployment

The application is optimized for deployment on **Netlify** with zero configuration:
1. Link your GitHub repository to Netlify.
2. Build Settings:
   - **Build Command:** `npm run build` (This automatically triggers `npm run prebuild` for dynamic sitemaps).
   - **Publish Directory:** `build`
3. Environment Variables:
   - Add `REACT_APP_SUPABASE_URL` and `REACT_APP_SUPABASE_ANON_KEY` in the Netlify Dashboard (**Site Settings -> Environment Variables**).
4. The included `netlify.toml` automatically handles SPA client-side routing redirects (`/* -> /index.html 200`) and security headers.

---

## 🛡️ Data Integrity & Contribution Guidelines

This repository follows strict safety and non-destructive data policies:
- **Zero Data Loss:** Database tables must never be truncated or wiped. Bug fixes must never overwrite user records with hardcoded dummy defaults.
- **Additive Migrations:** Schema changes must always use `ADD COLUMN IF NOT EXISTS` and non-destructive defaults.
- **Git Safety Protocol:** Every change is thoroughly tested and committed locally. Pushes to remote branches (`origin/master`) require explicit approval.

---

## 📬 Contact & Connect

**Md. Maharab Hosen**  
*Full-Stack Software Engineer & Mobile Developer*

- 🌐 **Portfolio:** [dev-maharab.netlify.app](https://dev-maharab.netlify.app/)
- 💻 **GitHub:** [@Maharab2134](https://github.com/Maharab2134)
- 💼 **LinkedIn:** [Maharab Hosen](https://www.linkedin.com/in/maharabhosen/)
- 📧 **Email:** [maharab442@gmail.com](mailto:maharab442@gmail.com)

---

<div align="center">
  <sub>Designed & Engineered with ❤️ by Md. Maharab Hosen. Distributed under the MIT License.</sub>
</div>
