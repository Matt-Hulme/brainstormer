# Frontend Rules

These rules apply specifically to the React/TypeScript frontend.

## Project Structure

```
frontend/
├── src/
│   ├── components/     # Reusable UI components
│   │   ├── common/     # Shared components (buttons, inputs, etc.)
│   │   └── features/   # Feature-specific components
│   ├── pages/         # Page components (routes)
│   ├── hooks/         # Custom React hooks
│   ├── utils/         # Utility functions
│   ├── types/         # TypeScript types/interfaces
│   ├── services/      # API and external service integrations
│   └── styles/        # Global styles and theme
```

## File Naming

### Components

- Use PascalCase for component files
- Examples: `Button.tsx`, `LoginForm.tsx`, `UserProfile.tsx`

### Utilities and Hooks

- Use camelCase for utility files and hooks
- Examples: `useAuth.ts`, `formatDate.ts`, `apiUtils.ts`

### Types

- Use PascalCase with `.types.ts` suffix
- Examples: `User.types.ts`, `ApiResponse.types.ts`

## Component Organization

### Component Structure

```
components/
└── Button/
    ├── Button.tsx
    └── Button.styles.ts
```

### Component Rules

- One component per file
- Component files should be in a folder with the same name
- Keep components focused and single-responsibility
- Use composition over inheritance
- No index.ts files - use direct imports

## Code Style

### Component Declaration

```typescript
export const ComponentName = () => {
  return (
    // JSX
  );
};
```

### Import Order

```typescript
// 1. React and external libraries
import React from 'react'
import { useNavigate } from 'react-router-dom'

// 2. Types
import { User } from '@/types'

// 3. Components
import { Button } from '@/components/common/Button/Button'

// 4. Hooks
import { useAuth } from '@/hooks/useAuth'

// 5. Utils
import { formatDate } from '@/utils/formatDate'

// 6. Styles
import './styles.css'
```

### Import Rules

- Never use wildcard imports (`import * as X`)
  - Preferred: `import { useState, useEffect } from 'react'`
  - Avoid: `import * as React from 'react'`
- Be explicit about what you're importing
- This improves code clarity, bundle size optimization, and IDE auto-imports

### Export Rules

- Use named exports for all components
- Use named exports for utilities and hooks
- Export types from types directory
- No index.ts files - use direct imports

## TypeScript Guidelines

### Type Definitions

- Use interfaces for component props
- Use types for utility types
- Export types from types directory
- Use strict mode

### Type Imports

- Import React types directly instead of using the React namespace
  - Preferred: `import { ChangeEvent } from 'react'`
  - Avoid: `React.ChangeEvent`
- This applies to all React types: ChangeEvent, MouseEvent, KeyboardEvent, ReactNode, etc.

### Type Naming

- Interface names should be prefixed with 'I' (e.g., `IUserProps`)
- Type names should be descriptive (e.g., `ApiResponse<T>`)
- Generic types should use T, U, V convention

## API Integration

### API Structure

- All API calls in services directory
- Use typed API responses
- Handle errors consistently
- Use environment variables for API endpoints

### API Rules

- Use typed request/response interfaces
- Implement proper error handling
- Use interceptors for common headers
- Cache responses when appropriate

## Styling

### CSS Rules

- Use Tailwind CSS for styling
- Follow mobile-first approach
- Keep styles modular and scoped
- Use CSS variables for theming
- Avoid inline styles

### Class Name Handling

- Use the `classnames` package for conditional class names
  - Import: `import classNames from 'classnames'`
  - Usage: `className={classNames('base-class', isActive && 'active-class')}`
- Avoid creating custom utilities for class name management
- Keep class names readable and descriptive

### Responsive Design

- Design for mobile first
- Use responsive units (rem, em)
- Test on multiple devices
- Implement proper breakpoints

---

_Note: These rules should be followed for all new code. Existing code should be updated to follow these rules when modified._
