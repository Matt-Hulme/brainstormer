---
description: Backend development guidelines including API structure, error handling, and database practices
globs: ["backend/app/**/*.py"]
alwaysApply: true
---
# Backend Development Guide

## Project Structure
Key directories and their purposes:
- [backend/app/api](mdc:backend/app/api) - API routes and endpoints
- [backend/app/core](mdc:backend/app/core) - Core functionality
- [backend/app/models](mdc:backend/app/models) - Data models
- [backend/app/schemas](mdc:backend/app/schemas) - Pydantic schemas
- [backend/app/services](mdc:backend/app/services) - Business logic
- [backend/app/utils](mdc:backend/app/utils) - Utility functions

## Import Rules
1. No wildcard imports (from module import *)
2. Import directly from source files
3. Use explicit imports for better code traceability
4. Keep imports organized and grouped:
   - Standard library imports
   - Third-party imports
   - Local application imports
5. Use absolute imports over relative imports

## Code Style
1. Follow PEP 8 guidelines
2. Use type hints
3. Keep functions focused and small
4. Use docstrings for public functions
5. Maximum line length: 88 characters (Black formatter)
6. Avoid barrel imports (index.ts/py files that re-export multiple modules)
7. Import directly from source files for better code traceability

## FastAPI Guidelines
1. Group related endpoints
2. Use proper HTTP methods
3. Include response models
4. Document all endpoints
5. Use dependency injection

## Database Rules
1. Use SQLAlchemy models
2. Include proper relationships
3. Add indexes where needed
4. Use Alembic for migrations
5. Keep migrations atomic

## Security Guidelines
1. Use JWT tokens for authentication
2. Implement proper password hashing
3. Use secure session management
4. Implement rate limiting
5. Validate all input data with Pydantic

## Testing Requirements
1. Use pytest
2. Group tests by feature
3. Use fixtures for common setup
4. Include both positive and negative tests
5. Follow AAA pattern (Arrange, Act, Assert)
