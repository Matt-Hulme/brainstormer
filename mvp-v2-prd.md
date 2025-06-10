# Brainstormer MVP V2 - Product Requirements Document (PRD)

## Purpose

This version of Brainstormer is focused on getting a **testable user flow** live.

Expect some rough edges. Post-MVP polish and extra functionality (editing Saved Words, sharing/exporting) are deferred until after initial user feedback.

## Overview

Brainstormer is an LLM-powered brainstorming tool where users manage **Projects**, **Collections** (search queries), and **Saved Words**.

It helps users generate and organize keyword ideas.

### Core Object Model:

- **Projects:** A project is a top-level container for collections. If a user initiates a search from the project details page and no project exists, a new project is created automatically.

- **Collections:** A collection is created as soon as a search query is performed within a project. Each collection represents a unique search query (by `collectionId`), and may contain zero or more saved words. Collections exist even if no words have been saved yet.

- **Saved Words:** Saved words are user-selected keywords associated with a specific collection. Each saved word is uniquely identified by a `savedWordId` and belongs to a single collection.

- **ID as Source of Truth:** All relationships and lookups between entities (Projects, Collections, Saved Words) are based on unique IDs (`projectId`, `collectionId`, `savedWordId`), not names or search phrases. Names and search queries are for display and user context only; all operations and references use IDs as the canonical source of truth.

- **Creation Flow:** When a user performs their first search from the project details page, both a new project (if needed) and a new collection (for that search query) are created simultaneously.


## Technical Stack & High-Level Architecture

- **Frontend**: React, shadcn/ui, React Query, Axios, Supabase Auth
- **Backend**: FastAPI, Supabase (PostgreSQL), REST API, Docker
- **Authentication**: Anonymous via Supabase
- **Routing**: `/userId/projects`, `/userId/projects/:projectName`, `/userId/projects/:projectName/search?q=searchterm`
- **Security**: RLS, rate limiting, environment variable management
- **API Path Conventions**:
  - Base paths are defined without trailing slashes (e.g., `/projects`, `/collections`)
  - Resource paths use forward slashes for path segments (e.g., `/projects/{id}`, `/collections/{id}/word`)
  - Nested resources use explicit path segments (e.g., `/collections/project/{projectId}`)
  - Bulk operations use `/bulk` suffix (e.g., `/collections/bulk`, `/saved-words/bulk`)
  - All paths are relative to the API base URL (e.g., `http://localhost:8000/api/v1`)
- **API Data Shape**:
  - `GET /projects` returns a list of projects (with `projectId`, no collections or saved words included)
  - `GET /projects/{project_id}` returns the project (by `projectId`), its collections (by `collectionId`), and all saved words (by `savedWordId`) within those collections (nested)

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
- **Data:** Loaded from a single API call to `/projects/{project_id}` which returns the project, its collections, and all saved words within those collections

### 4. Search Results Page
- Search bar, view toggles, loading state, keyword suggestions, multi-select, collections sidebar
- **Collection Creation:** A collection is created as soon as a user performs a search. Saved words can then be added to that collection, but collections may exist with zero saved words. All collection operations use `collectionId` as the source of truth, not the search phrase or collection name.

## Core Functionality
- Anonymous authentication
- Create/View Projects
- View Collections within Projects
- View Saved Words within Collections
- Search and keyword suggestions (phrase-based, maximum 3 phrases per search, 3 words per phrase)
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
- [ ] Collection creation works from all 4 entry points
- [x] Single-word search validation (max 5 words, no spaces)
- [x] AND search functionality working
- [x] Project name displayed in Collections Sidebar

## Walkthrough Updates

Based on cofounder feedback from initial walkthrough, the following improvements are needed:

### Search Bar Improvements
- [x] **Button alignment**: Fix visual alignment of search button with input field
- [x] **Extra phrase cleanup**: Change these to be inline
- [x] **Text contrast**: Make actual search text darker than placeholder text for better readability
- [x] **Term highlighting**: Clicking on a search term in the Search Bar should focus AND highlight that specific term

### Navigation & Sidebar Updates
- [x] **Dynamic left sidebar**: Left sidebar should sometimes show a back arrow usually, but when on the ProjectDetails page, show the hamburger menu that triggers the 'undeveloped toast'
- [x] **Add collection functionality**: "Add a collection" button in right sidebar needs to trigger a new search flow instead of just focusing the search bar
- [x] **Project navigation**: Project details page (when clicking into a project card) needs to navigate to the correct/most recent search, not just the last search performed

### Loading & UX Improvements
- [x] **Better loading treatment**: Improve loading states on the Search.tsx page (spinner should work)

### Authentication & Session Management
- [x] **Unique user sessions**: Each admin login now generates a unique anonymous ID, ensuring users on different computers have separate project sets

These updates focus on polish and user experience improvements identified during the walkthrough process.

## Finishing Touches

Critical issues and improvements needed for MVP completion:

### Collection Creation Flow
- [x] **Fix collection creation logic**: There are 4 ways to create a new collection that now work correctly:
  1. **From ProjectsList page**: ✅ Initiating a new search creates both a new project and a new collection
  2. **From Search page**: ✅ Initiating a new search creates a new collection (if search term exists, select that existing collection instead)
  3. **From Collections Sidebar**: ✅ Clicking 'Add to Collection' now directly creates a new collection with auto-generated name
  4. **From ProjectDetails page**: ✅ Clicking 'Add to Collection' now directly creates a new collection with auto-generated name
- [x] **Word association**: All subsequent words selected after any of these 4 methods are associated with the newly created collection
- [x] **User Experience**: Collections are created immediately with success feedback, and auto-generated names avoid conflicts

### UI/UX Improvements
- [x] **Project name in Collections Sidebar**: Add project name copy to Collections Sidebar using the same font size as ProjectDetails page, replacing the current 'SAVED WORDS' copy

### Search Functionality
- [x] **Fix AND functionality**: Fixed toggle visibility to show for multiple phrases (2+ phrases) instead of multiple words
- [x] **Phrase-based search constraints**: Implement phrase-based search with the following rules:
  - Maximum 3 phrases per search query
  - Maximum 3 words per phrase (allowing 1 space between words within a phrase)
  - Block phrases containing multiple consecutive spaces
  - Allow up to 3 separate phrases in one search

### Search Input Validation
- [x] **Phrase validation**: Allow phrases with up to 3 words (2 spaces maximum per phrase) with silent input blocking for invalid input
- [x] **Maximum phrase limit**: Enforce maximum 3 phrases per search query
- [x] **User feedback**: Silent input blocking without error messages or toast notifications
- [x] **Remove space-to-jump navigation**: Remove automatic focus movement when user types a space - spaces are now allowed within phrases

---

## Future Iterations

### Performance Improvements
1. **Streaming Search Results** ✅ **IMPLEMENTED**
   - **Backend**: Server-Sent Events (SSE) streaming endpoint at `/api/v1/search/stream`
   - **Real-time delivery**: Keywords appear as OpenAI generates them (no more waiting for full response)
   - **Progressive loading**: Users see results immediately, dramatically improving perceived performance
   - **Status indicators**: Progress updates every 10 suggestions with total count
   - **Cancellation support**: Users can cancel long-running searches
   - **Error handling**: Graceful error handling with streaming error messages
   - **Load time improvement**: From 15-30 seconds to immediate results streaming

2. **Hybrid Search Result Caching** ✅ **IMPLEMENTED**
   - **Architecture**: Multi-layer cache strategy combining React Query (in-memory) with SessionStorage (persistence)
   - **Performance Tiers**:
     - **L1 Cache (React Query)**: Lightning-fast in-memory cache for immediate access within session
     - **L2 Cache (SessionStorage)**: Survives page reloads within the same browser tab/session
     - **Cache Duration**: 30 minutes with automatic cleanup of expired entries
   - **Smart Fallback Logic**:
     - First checks React Query cache (fastest)
     - Falls back to SessionStorage if not in memory
     - Automatically promotes SessionStorage hits back to React Query for future speed
     - Only hits streaming API when no cache is available
   - **Search Mode Separation**: ✅ **Cache properly separates AND vs OR search results**
     - **Independent Caching**: AND and OR search modes are cached separately for the same query
     - **Mode-Specific Keys**: Cache keys include search mode (`project-query-or` vs `project-query-and`)
     - **Toggle Behavior**: Switching between AND/OR modes triggers proper cache lookup or new search
     - **No Animation on Cache**: Cached results appear instantly without animation, fresh results animate in
   - **Privacy-Friendly**: SessionStorage automatically clears when user closes tab (no persistent cross-session storage)
   - **User Experience**:
     - **Cached Results**: Appear instantly without animation delays
     - **Fresh Results**: Animate in with staggered timing for visual feedback
     - **LoadMore Button**: Shows immediately for cached results, waits for animations on streaming results
   - **Memory Management**: Automatic cleanup of expired entries and intelligent cache size management
   - **Cache Invalidation**: Project-specific cache clearing when data changes
   - **Performance Impact**: Search results that previously took 15-30 seconds now load instantly on repeat queries

3. **Future Caching Enhancements**
   - Cache frequent search results server-side
   - Pre-generate suggestions for common terms
   - Optimize OpenAI prompts for faster responses
   - Consider model alternatives for speed/quality tradeoffs
   - Implement IndexedDB for offline capabilities and larger datasets

4. **Comprehensive Analytics Platform**
   - **Current State**: Basic mutation tracking via Supabase built-in logging for beta testing
   - **Future Vision**: Full-featured analytics platform with:
     - Real-time user behavior tracking and session analytics
     - Search pattern analysis and keyword trend identification
     - Performance metrics and API response time monitoring
     - A/B testing framework for feature experimentation
     - Conversion funnel analysis (search → save → collection usage)
     - User journey mapping and retention analytics
     - Custom dashboards for product insights
     - Integration with external analytics tools (Mixpanel, Amplitude)
   - **Beta Phase**: Leverage Supabase Logs Explorer for basic mutation tracking
   - **Post-MVP**: Dedicated analytics service with custom event tracking

5. **Advanced Features**
   - User accounts and authentication
   - Project sharing and collaboration
   - Export functionality
   - Manual word editing
   - Advanced search filters
   - Custom collections organization

6. **UI/UX Enhancements**
   - Dark mode
   - Mobile optimization
   - Keyboard shortcuts
   - Drag-and-drop interface
   - Custom themes
   - Accessibility improvements

## References
- See `mvp-v2-roadmap.md` for implementation phases, milestones, and tactical planning.

# API Route Path Convention

- The API version prefix (API_V1_STR) must never have a trailing slash (e.g., use '/api/v1', not '/api/v1/').
- All FastAPI route decorators must avoid trailing slashes (e.g., use @router.get('/resource'), not @router.get('/resource/')).
- All frontend API calls must match the backend route exactly, with no double slashes and no trailing slashes unless explicitly required.
- This convention ensures consistent routing, avoids 405 errors, and prevents accidental double slashes in URLs.

