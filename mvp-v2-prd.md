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
/                     # Home page (starting point for all users)
/projects             # Projects list (automatically authenticates anonymously)
/projects/new         # Create new project
/projects/:projectId  # Project page (collections overview)
/projects/:projectId/search  # Search results within project
/projects/:projectId/search?searchId=123  # Specific search session
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
- CTA Button: **"Create New Project"**

### 3. Projects Page (Filled State)

- Displays a list of existing Projects.
- Projects show Title.
- Clicking a Project opens Project Page (Collections Overview).

### 4. Search Results (inside a Project)

- **Top Search Bar**: Type a keyword to brainstorm ideas.
- **Searching State**: Loading animation.
- **Loaded State**:

  - List of suggested Keywords.
  - Ability to select one or multiple Keywords.
  - Save selected Keywords into a Collection (existing or new).

- **Right Sidebar**:

  - Lists existing Collections within the current Project.
  - Button to **Add New Collection**.
  - Ability to edit (rename) or delete Collections.

- **Saved Words**:
  - Within Collections, users can:
    - Delete Saved Words.
    - (Post-MVP) Edit or manually add Saved Words.

### 5. Project Page (Collections Overview)

- Full-page view of all Collections grouped inside a Project.
- Shows:
  - Collection Title
  - Saved Words within each Collection
- Basic management:
  - Delete Collection
  - Delete Saved Words inside Collection

## Core Functionality

### Authentication

- Anonymous authentication (automatic)
- Future upgrade path to full accounts (post-MVP)

### Project Management

- Create, View, Delete Projects
- Projects have only a **Title** (no descriptions/tags)

### Collection Management

- Create, View, Rename, Delete Collections
- Collections belong to a single Project

### Saved Word Management

- Save single or multiple Keywords from search results
- Delete Saved Words inside Collections
- (Post-MVP) Edit or manually add Saved Words

### Search and Keyword Suggestions

- Enter a search term
- Fetch LLM-generated suggestions
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

- [ ] Anonymous authentication works automatically.
- [ ] Home page and Projects page are functional.
- [ ] Anonymous users see an empty state if no Projects exist.
- [ ] Users can create and view Projects.
- [ ] Inside Projects, users can Search for new Keywords.
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
       - design-system/ (flexible UI primitives like Button)a
       - Application-specific components at root level (SearchBar, etc.)
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

### Phase 2: Frontend Development - Page by Page

1. **General Component Strategy**

   - Create page-specific components as needed
   - Install required shadcn/ui components for each page/feature
   - Keep components focused on current needs without over-engineering

2. **Home Page**

   - Create layout components
   - Implement hero section with tagline
   - Add "Give it a Try" CTA button logic with navigation to Projects page
   - Add "Log in" button logic with navigation to Projects page

3. **Projects Page (Empty State)**

   - Create empty state UI
   - Implement "Create New Project" button

4. **Projects Page (Filled State)**

   - Create project list component
   - Implement project card component
   - Add project navigation

5. **Search Results Page**

   - Create search bar component
   - Implement loading state
   - Create keyword suggestion list
   - Add multi-select functionality
   - Create right sidebar for collections
   - Implement save to collection functionality
   - Set up searchId parameter handling

6. **Project Page (Collections Overview)**
   - Create collection list view
   - Implement saved words display
   - Add collection management UI

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

