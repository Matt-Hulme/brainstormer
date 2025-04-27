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
  - React Context (for auth state and app-wide settings)
  - Local component state with useState/useEffect
- **API Client**: Axios for HTTP requests
  - Simple data fetching
  - Error handling
  - Request/response interceptors for auth

### Backend

- **Framework**: Python (FastAPI)
- **Database & Auth**: Supabase
  - PostgreSQL database
  - Built-in authentication
  - Row Level Security (RLS)
  - Analytics for painted door features
- **API**: REST endpoints
- **Containerization**: Docker

### Security Considerations

- Authentication required for all operations
- Row Level Security (RLS) policies for data access
- Basic rate limiting
- Environment variable management

## User Roles

- **Anonymous User**: Can browse Logged Out Home, Login/Sign Up.
- **Authenticated User**: Full access to Projects, Collections, Search, and Saved Words.

## Pages / Flows

### 1. Logged Out Home

- Intro to Brainstormer
- Tagline and short description
- CTA: **"Give it a Try"** → routes to **Log In / Sign Up**

### 2. Log In / Sign Up

- Minimal login/signup form
- Email/password auth (or OAuth if available)
- Links to switch between Log In and Sign Up

### 3. Logged In Home (Empty State)

- Message: **"Looks like you don't have any projects yet!"**
- CTA Button: **"Create New Project"**

### 4. Logged In Home (Filled State)

- Displays a list of existing Projects.
- Projects show Title.
- Clicking a Project opens Search Results view inside that Project.

### 5. Search Results (inside a Project)

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

### 6. Project Page (Collections Overview)

- Full-page view of all Collections grouped inside a Project.
- Shows:
  - Collection Title
  - Saved Words within each Collection
- Basic management:
  - Delete Collection
  - Delete Saved Words inside Collection

## Core Functionality

### Authentication

- Sign up, Log in, Log out

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

> **Note**: Keep Painted Door actions visually subtle but discoverable.

## UX Notes

- Keep the flow lightweight and fast — prioritize responsiveness over perfection for this phase.
- Small loading/shimmer animation during LLM search fetch.
- Toast/confirmation for actions like "Keyword Saved."
- Sticky right sidebar (Collections) during Search Results view.
- No need for "Undo" on delete actions for MVP (simple delete confirmation popup is fine if needed).

## Out of Scope (Post-MVP ideas)

- Manually editing or adding Saved Words (after search)
- Sharing/exporting Projects
- Project descriptions, tags, or metadata

## Acceptance Criteria (Cursor-ready checklist)

- [ ] Users can Sign Up, Log In, Log Out.
- [ ] Logged Out Home and Log In/Sign Up pages are functional.
- [ ] Authenticated users see an empty state if no Projects exist.
- [ ] Users can create and view Projects.
- [ ] Inside Projects, users can Search for new Keywords.
- [ ] Searching triggers loading state and populates suggestions.
- [ ] Users can select one or multiple Keywords and Save to a Collection.
- [ ] Right sidebar shows Collections.
- [ ] Users can create, rename, and delete Collections.
- [ ] Inside Collections, users can delete individual Saved Words.
- [ ] Project Page shows all Collections grouped.