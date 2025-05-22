# Brainstormer Frontend

This is the frontend application for Brainstormer, built with React, TypeScript, and Vite.

## Prerequisites

- Node.js 18 or higher
- npm or yarn

## Setup

1. Install dependencies:
```bash
npm install
# or
yarn install
```

2. Set up environment variables:
Create a `.env` file in the root directory with the following variables:
```env
VITE_API_URL=http://localhost:8000
```

## Running the Development Server

```bash
npm run dev
# or
yarn dev
```

The application will start at `http://localhost:5173`

## Building for Production

```bash
npm run build
# or
yarn build
```

The built files will be in the `dist` directory.

## Project Structure

```
frontend/
├── src/                    # Source code
│   ├── components/        # Reusable components
│   ├── pages/            # Page components
│   ├── hooks/            # Custom React hooks
│   ├── services/         # API services
│   └── types/            # TypeScript types
├── public/               # Static assets
├── package.json          # Dependencies and scripts
└── vite.config.ts        # Vite configuration
```

## Development

- The development server supports hot module replacement (HMR)
- Use the browser's developer tools for debugging
- Check the console for any errors or warnings

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Tech Stack

- React with TypeScript
- React Router for routing
- Supabase for authentication
- Axios for API requests
- Tailwind CSS for styling
- shadcn/ui component library

## Routes

- `/` - Home page
- `/projects` - Projects list
- `/projects/new` - Create new project
- `/projects/:projectId` - Project page (collections overview)
- `/projects/:projectId/search` - Search results within project
- `/projects/:projectId/search?searchId=123` - Specific search session
