# Brainstormer MVP V2 - Development Roadmap

_See `mvp-v2-prd.md` for product requirements, user flows, and high-level architecture._

## Phases & Milestones

### Phase 1: Frontend Setup and Configuration ✅
- Project initialization, UI framework, project structure, routing, Supabase setup, API client

### Phase 2: Frontend Development - Page by Page ✅
- Home page, Projects page (empty/filled), Search Results page, Project Details page
- General component strategy: page-specific components, shadcn/ui, focused on current needs

### Phase 3: Backend Development (Current Focus)
- FastAPI setup, Supabase connection, authentication middleware, environment config
- Database schema: projects, collections, saved_words, search_sessions
- RLS policies, indexes, constraints
- API endpoints: projects, collections, saved words, search/keyword suggestions
- Rate limiting (Redis-based, per endpoint type)
- Integration: API services, bulk operations, type definitions, error handling

### Phase 4: Data-Integration + Multi-Search (Next Focus)
- Data integration improvements: API client functions, data fetching hooks, error/loading states, pagination
- Multi-phrase search implementation: UI, backend, "OR" logic, result prioritization

### Phase 5: Testing and Deployment
- User flow testing, bug fixes, error handling
- Manual deployment, monitoring, documentation

## Database Schema Versioning
- Schema lives in `backend/sql/schema.sql`. Run in Supabase SQL editor to recreate tables.

## RLS Policy Reference
- See PRD for high-level security; see schema.sql for implementation details.

## Out of Scope (Post-MVP)
- Full user accounts, manual saved word editing, sharing/exporting, project metadata

---

_This roadmap is a living document. Update as phases complete or priorities shift._ 