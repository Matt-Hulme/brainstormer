# Brainstormer MVP V2 - Product Requirements Document (PRD)

## Purpose

This version of Brainstormer is focused on getting a **testable user flow** live.

Expect some rough edges. Post-MVP polish and extra functionality (editing Saved Words, sharing/exporting) are deferred until after initial user feedback.

## Overview

Brainstormer is an LLM-powered brainstorming tool where users manage **Projects**, **Collections**, and **Saved Words**.

It helps users generate and organize keyword ideas.

### Core Object Model:

- **Projects** → contain → **Collections** → contain → **Saved Words**.

## Technical Stack & High-Level Architecture

- **Frontend**: React, shadcn/ui, React Query, Axios, Supabase Auth
- **Backend**: FastAPI, Supabase (PostgreSQL), REST API, Docker
- **Authentication**: Anonymous via Supabase
- **Routing**: `/userId/projects`, `/userId/projects/:projectName`, `/userId/projects/:projectName/search?q=searchterm`
- **Security**: RLS, rate limiting, environment variable management
- **API Data Shape**:
  - `GET /projects` returns a list of projects (no collections or saved words included)
  - `GET /projects/{project_name}` returns the project, its collections, and all saved words within those collections (nested)

## User Roles

- **Anonymous User**: Full access to Projects, Collections, Search, and Saved Words with a unique anonymous ID.

## Pages / Flows

### 1. Home Page
- Intro, tagline, CTA to Projects

### 2. Projects Page (Empty/Filled State)
- Empty: Message, illustration, CTA
- Filled: Welcome, list of projects, search bar, project cards

### 3. Project Details Page
- Header (title, last edited, profile pic)
- Two-column: collections (left), saved words (right)
- **Data:** Loaded from a single API call to `/projects/{project_name}` which returns the project, its collections, and all saved words within those collections

### 4. Search Results Page
- Search bar, view toggles, loading state, keyword suggestions, multi-select, collections sidebar

## Core Functionality
- Anonymous authentication
- Create/View Projects
- View Collections within Projects
- View Saved Words within Collections
- Search and keyword suggestions (single-phrase for MVP)
- Painted door features for future ideas

## Security & Performance
- RLS for all tables
- Rate limiting (per endpoint type)
- Fast search and project load times

## Acceptance Criteria
- [x] Anonymous auth works
- [x] Home/Projects page functional
- [x] Empty state for no projects
- [x] Create/view projects
- [x] Project details show collections/words
- [x] Search interface with loading
- [x] Select/save keywords
- [x] Collections sidebar
- [x] Create/rename/delete collections
- [x] Delete saved words
- [x] Project page shows all collections grouped

## Painted Door Features
- "Manually Add a Saved Word" button
- "Share Project" or "Export" button
- "Create an account to save your work" button

> Clicking these triggers a toast and logs interest.

---

## Future Iterations

### Performance Improvements
1. **Streaming Search Results**
   - Implement streaming API endpoint for real-time result delivery
   - Progressive loading UI with partial results display
   - Status indicators for search progress (OR matches, AND matches)
   - Estimated completion time based on query complexity

2. **Caching & Optimization**
   - Cache frequent search results
   - Pre-generate suggestions for common terms
   - Optimize OpenAI prompts for faster responses
   - Consider model alternatives for speed/quality tradeoffs

3. **Enhanced Analytics**
   - User behavior tracking
   - Search pattern analysis
   - Performance metrics
   - A/B testing framework
   - Conversion tracking
   - User journey mapping

4. **Advanced Features**
   - User accounts and authentication
   - Project sharing and collaboration
   - Export functionality
   - Manual word editing
   - Advanced search filters
   - Custom collections organization

5. **UI/UX Enhancements**
   - Dark mode
   - Mobile optimization
   - Keyboard shortcuts
   - Drag-and-drop interface
   - Custom themes
   - Accessibility improvements

## References
- See `mvp-v2-roadmap.md` for implementation phases, milestones, and tactical planning.

