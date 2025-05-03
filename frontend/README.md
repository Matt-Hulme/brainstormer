# Brainstormer Frontend

This is the frontend application for Brainstormer, an LLM-powered brainstorming tool that helps users generate and organize keyword ideas.

## Tech Stack

- React with TypeScript
- React Router for routing
- Supabase for authentication
- Axios for API requests
- Tailwind CSS for styling
- shadcn/ui component library

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn

### Installation

1. Clone the repository
2. Navigate to the frontend directory:
   ```
   cd brainstormer/frontend
   ```
3. Install dependencies:
   ```
   npm install
   ```

### Environment Setup

Create a `.env.local` file in the frontend directory with the following variables:

```
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# API Configuration
VITE_API_URL=http://localhost:8000
```

For local development with Supabase:

- VITE_SUPABASE_URL is typically http://localhost:54321
- Get your local VITE_SUPABASE_ANON_KEY from the Supabase dashboard

### Development

Run the development server:

```
npm run dev
```

The application will be available at http://localhost:5173

### Building for Production

Build the application:

```
npm run build
```

## Project Structure

- `src/` - Main source code
  - `components/` - Reusable UI components
  - `lib/` - Utility functions, API clients, and types
  - `pages/` - Page components
    - `Projects/` - Project-related pages
  - `App.tsx` - Main application component with routing
  - `main.tsx` - Application entry point

## Routes

- `/` - Home page
- `/projects` - Projects list
- `/projects/new` - Create new project
- `/projects/:projectId` - Project page (collections overview)
- `/projects/:projectId/search` - Search results within project
- `/projects/:projectId/search?searchId=123` - Specific search session
