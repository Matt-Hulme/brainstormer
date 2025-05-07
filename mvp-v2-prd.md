# Brainstormer MVP V2 - Product Requirements Document (PRD)

## Purpose

This version of Brainstormer is focused on getting a **testable user flow** live.

Expect some rough edges. Post-MVP polish and extra functionality (editing Saved Words, sharing/exporting) are deferred until after initial user feedback.

## Overview

Brainstormer is an LLM-powered brainstorming tool where users manage **Projects**, **Collections**, and **Saved Words**.

It helps users generate and organize keyword ideas.

### Core Object Model:

- **Projects** → contain → **Collections** → contain → **Saved Words**.

## Technical Stack

### Frontend

- **Framework**: React
- **UI Library**: shadcn/ui
  - Built on Radix UI primitives
  - Pre-built components for faster development
  - Built-in accessibility and theming
  - Modern, responsive design system
- **State Management**:
  - Local component state with useState/useEffect
  - Co-located hooks with their relevant components/features
- **API Client**: Axios for HTTP requests
  - Simple data fetching
  - Error handling
  - Request/response interceptors for auth
- **Authentication**: Supabase
  - Anonymous authentication for tracking individual users
  - No explicit signup/login required from users
  - Option to upgrade to full accounts in the future

### Backend

- **Framework**: Python (FastAPI)
- **Database & Auth**: Supabase
  - PostgreSQL database
  - Anonymous authentication
  - Row Level Security (RLS) for data access
  - Analytics for painted door features
- **API**: REST endpoints
- **Containerization**: Docker

### Routing Structure

```
/                                 # Home page (starting point for all users)
/:userId/projects                 # Projects list (automatically authenticates anonymously)
/:userId/projects/:projectName    # Project page (collections overview)
/:userId/projects/:projectName/search?q=searchterm  # Search results within project with search term as query parameter
```

### Security Considerations

- Anonymous authentication for tracking individual users
- Row Level Security (RLS) policies for data access
- Basic rate limiting
- Environment variable management

## User Roles

- **Anonymous User**: Full access to Projects, Collections, Search, and Saved Words with a unique anonymous ID.

## Pages / Flows

### 1. Home Page

- Intro to Brainstormer
- Tagline and short description
- CTA: **"Give it a Try"** → routes to **Projects** (with automatic anonymous auth)

### 2. Projects Page (Empty State)

- Message: **"Looks like you don't have any projects yet!"**
- Visual empty state with shapes illustration
- CTA: **"Use the search bar above to start a new project"**

### 3. Projects Page (Filled State)

- Welcome message: "Welcome back. Time to get mischievous."
- Displays a list of existing Projects with:
  - Project Title
  - Last edited timestamp
  - Collections count and names
  - Saved words count and preview
- Each project card is clickable and navigates to Project Details
- Search bar at the top for creating new projects

### 4. Project Details Page

- Header with:
  - Project title
  - Last edited timestamp
  - User profile picture
- Two-column layout:
  - Left column: Collection names
  - Right column: Saved words for each collection
- Collections are separated by dividers
- Each collection shows:
  - Collection name with arrow button
  - List of saved words or "No words (yet)" message
- Hamburger sidebar for navigation

### 5. Search Results Page

- **Search Interface**:
  - Search bar at the top
  - View toggle buttons in sidebar:
    - List view
    - Connections view
    - Focus view
- **Searching State**: Loading animation
- **Loaded State**:
  - Horizontal list of search terms
  - Terms can be selected/deselected
  - Selected terms appear in collections sidebar
  - Collections sidebar for managing saved words
- **URL Structure**:
  - Uses query parameter for search term: `?q=searchterm`
  - View type parameter: `?view=list|connections|focus`

## Core Functionality

### Authentication

- Anonymous authentication (automatic)
- Future upgrade path to full accounts (post-MVP)

### Project Management

- Create, View Projects
- Projects have:
  - Title
  - Last edited timestamp
  - Collections
  - Saved words

### Collection Management

- View Collections within Projects
- Collections show:
  - Name
  - List of saved words
  - Empty state when no words

### Saved Word Management

- View saved words within collections
- Words are organized by collection
- Empty state handling when no words exist

### Search and Keyword Suggestions

- Multi-phrase search functionality:
  - A search query is made up of 1-3 distinct phrases
  - Each phrase can contain 1-3 words maximum
  - Example: "Guybrush Threepwood Pirate" + "Funny" + "Games"
  - Backend searches for results matching ANY of the phrases ("OR" logic)
  - Results that match multiple phrases may be prioritized
- Enter search phrases in a structured interface
- Fetch LLM-generated suggestions based on provided phrases
- Select and Save suggested Keywords
- Search sessions tracked with searchId parameter

### UI States

- Loading treatment during Search
- Empty states for no Projects, no Collections, no Saved Words
- Multi-select Keyword actions (batch Save)

## Painted Doors (Test Features)

We will include Painted Door features to gather user interest data without fully building the feature yet.

Clicking a Painted Door feature will trigger a simple toast message like:

> "Coming soon! Thanks for your interest."

We will log these clicks for analysis.

### Painted Door Targets (Examples):

- "Manually Add a Saved Word" button
- "Share Project" or "Export" button
- "Create an account to save your work" button

> **Note**: Keep Painted Door actions visually subtle but discoverable.

## UX Notes

- Keep the flow lightweight and fast — prioritize responsiveness over perfection for this phase.
- Small loading/shimmer animation during LLM search fetch.
- Toast/confirmation for actions like "Keyword Saved."
- Sticky right sidebar (Collections) during Search Results view.
- No need for "Undo" on delete actions for MVP (simple delete confirmation popup is fine if needed).

## Out of Scope (Post-MVP ideas)

- Full user accounts (email/password signup)
- Manually editing or adding Saved Words (after search)
- Sharing/exporting Projects
- Project descriptions, tags, or metadata

## Acceptance Criteria (Cursor-ready checklist)

- [x] Anonymous authentication works automatically.
- [x] Home page and Projects page are functional.
- [x] Anonymous users see an empty state if no Projects exist.
- [x] Users can create and view Projects.
- [x] Project Details page shows collections and saved words
- [x] Search interface with loading states
- [x] Search terms can be selected/deselected
- [x] Collections sidebar for managing saved words
- [x] View toggles for different search result displays
- [ ] Inside Projects, users can Search for new Keywords (initially with single-phrase search).
  - Note: Multi-phrase search will be implemented in Phase 2.6 post-initial feedback.
- [ ] Searching triggers loading state and populates suggestions.
- [ ] Search sessions can be tracked with searchId parameter.
- [ ] Users can select one or multiple Keywords and Save to a Collection.
- [ ] Right sidebar shows Collections.
- [ ] Users can create, rename, and delete Collections.
- [ ] Inside Collections, users can delete individual Saved Words.
- [ ] Project Page shows all Collections grouped.

## Development Roadmap

### Phase 1: Frontend Setup and Configuration

1. **Project Initialization** ✅

   - Set up a new React project with Vite ✅
   - Configure TypeScript ✅
   - Set up ESLint and Prettier ✅
   - Create basic project structure (components/, pages/, utils/) ✅
   - Clean up boilerplate code ✅
   - Configure code style (no semicolons) ✅

2. **UI Framework Setup** ✅

   - Install and configure Tailwind CSS ✅
     - Base configuration ✅
     - Typography system ✅
       - Headings (h1, h3, h4, h5)
       - Paragraphs (p1, p2, p3, p3-caps)
     - Color system ✅
       - Primary colors (yellows)
       - Secondary colors (grayscale)
       - Background color
   - Set up shadcn/ui components ✅
     - Initialize shadcn/ui ✅
     - Configure base theme ✅
       - Style: New York
       - Base color: Neutral
       - CSS variables configured ✅
     - Install components as needed during development ✅
       - Components will be added when required for specific features
       - Common needs will include: buttons, inputs, cards, dialogs, toasts, loading states, and checkboxes

3. **Project Structure**
   - Set up folder structure:
     - components/ (reusable UI components) ✅
       - design-system/ (flexible UI primitives like Button) ✅
       - Application-specific components at root level (SearchBar, etc.) ✅
     - pages/ (main page components with co-located hooks) ✅
     - utils/ (helper functions and utilities) ✅
   - Configure path aliases (@/\*) ✅
   - Configure routing with React Router ✅
     - Implement routing structure as defined above ✅
   - Set up Supabase ✅
     - Configure anonymous authentication ✅
     - Set up PostgreSQL database and tables
     - Configure Row Level Security (RLS) policies
   - Set up API client with Axios ✅

### Phase 2: Frontend Development - Page by Page ✅

1. **General Component Strategy** ✅

   - Create page-specific components as needed ✅
   - Install required shadcn/ui components for each page/feature ✅
   - Keep components focused on current needs without over-engineering ✅

2. **Home Page** ✅

   - Create layout components ✅
   - Implement hero section with tagline ✅
   - Add "Give it a Try" CTA button logic with navigation to Projects page ✅
   - Add "Log in" button logic with navigation to Projects page ✅

3. **Projects Page (Empty State)** ✅

   - Create empty state UI ✅
   - Implement "Create New Project" button ✅

4. **Projects Page (Filled State)** ✅

   - Create project list component ✅
   - Implement project card component ✅
   - Add project navigation ✅

5. **Search Results Page** ✅

   - Create search bar component (initially supporting single-phrase search) ✅
     - Note: Multi-phrase functionality is planned but deferred to Phase 2.6
   - Implement loading state ✅
   - Create keyword suggestion list ✅
   - Add multi-select functionality ✅
   - Create right sidebar for collections ✅
   - Implement save to collection functionality ✅
   - Set up searchId parameter handling ✅

6. **Project Page (Collections Overview)** ✅
   - Create collection list view ✅
   - Implement saved words display ✅
   - Add collection management UI ✅

### Phase 2.5: Multi-Phrase Search Implementation (Deferred)

1. **SearchBar Component Update**

   - Refactor SearchBar to support multiple phrases (1-3)
   - Implement word limit per phrase (max 3 words)
   - Add UI for phrase separation with visual indicators
   - Create "+" button functionality to add new phrases
   - Implement removal of phrases

2. **Search Parameter Handling**

   - Update URL structure to support multiple query parameters (q1, q2, q3)
   - Implement parsing of multi-phrase queries
   - Update search logic to handle multiple phrases

3. **Backend Integration**

   - Connect updated search UI to backend endpoints
   - Implement "OR" logic handling between phrases
   - Add result prioritization for items matching multiple phrases

4. **Testing and Refinement**
   - Test various search combinations
   - Optimize performance for multi-phrase queries
   - Fine-tune result ranking algorithm

> **Note**: This phase is intentionally deferred until after initial user feedback on the core functionality.

### Phase 2.6: Data Integration (In Progress)

1. **Replace Mock Data with Actual API Data**
   - Implement API client functions to fetch projects
   - Create data fetching hooks for projects list
   - Handle loading and error states
   - Implement proper state management for API data
   - Add pagination if needed for large datasets
   - Ensure proper error handling and fallbacks
   - Update components to use real data instead of mocks

### Phase 3: Backend Development

1. **Backend Setup**

   - Set up FastAPI project structure
   - Configure Supabase connection
   - Set up authentication middleware for anonymous users
   - Implement automatic anonymous authentication

2. **Database Schema**

   - Design and implement PostgreSQL tables
   - Set up Row Level Security policies

3. **API Endpoints**

   - Create project management endpoints
   - Implement collection management endpoints
   - Create saved words management endpoints
   - Implement search and keyword suggestion endpoints
     - Support for multi-phrase queries (1-3 phrases)
     - "OR" logic between phrases
     - Optional prioritization for results matching multiple phrases
     - Response structure optimized for frontend display

4. **Integration**
   - Connect frontend to backend API
   - Implement error handling
   - Add loading states

### Phase 4: Testing and Deployment

1. **Testing**

   - Test user flows
   - Fix bugs and issues
   - Implement error handling

2. **Deployment**
   - Manual deployment to production environment
   - Basic monitoring setup
   - Documentation for future maintenance

