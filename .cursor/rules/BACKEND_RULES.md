# Backend Rules

These rules apply specifically to the Python/FastAPI backend!

## Project Structure

```
backend/
├── app/              # Main application package
│   ├── api/         # API routes and endpoints
│   ├── core/        # Core functionality
│   ├── models/      # Data models
│   ├── schemas/     # Pydantic schemas
│   ├── services/    # Business logic
│   └── utils/       # Utility functions
├── tests/           # Test files
├── alembic/         # Database migrations
└── requirements.txt # Python dependencies
```

## File Naming

### Python Files

- Use snake_case for all Python files
- Examples: `user_service.py`, `auth_utils.py`
- Test files should match source files: `test_user_service.py`

### Module Names

- Use lowercase with underscores
- Keep names short but descriptive
- Avoid abbreviations

## Code Style

### Python Style

- Follow PEP 8 guidelines
- Use type hints
- Keep functions focused and small
- Use docstrings for public functions
- Maximum line length: 88 characters (Black formatter)

### Function Declaration

```python
def get_user_by_id(user_id: int) -> User:
    """
    Retrieve a user by their ID.

    Args:
        user_id: The ID of the user to retrieve

    Returns:
        User: The user object

    Raises:
        HTTPException: If user is not found
    """
    pass
```

### Import Order

```python
# 1. Standard library imports
import os
from typing import List

# 2. Third-party imports
from fastapi import FastAPI
from pydantic import BaseModel

# 3. Local imports
from app.models.user import User
from app.services.auth import AuthService
```

## FastAPI Guidelines

### Route Organization

- Group related endpoints
- Use proper HTTP methods
- Include response models
- Document all endpoints

### Example Route

```python
@router.post("/users", response_model=UserResponse)
async def create_user(
    user_data: UserCreate,
    auth_service: AuthService = Depends(get_auth_service)
) -> UserResponse:
    """
    Create a new user.

    Args:
        user_data: The user data to create
        auth_service: The authentication service

    Returns:
        UserResponse: The created user
    """
    pass
```

## Database

### Models

- Use SQLAlchemy models
- Include proper relationships
- Add indexes where needed
- Use appropriate column types

### Migrations

- Use Alembic for migrations
- Keep migrations atomic
- Include both up and down migrations
- Test migrations before applying

## Error Handling

### Exception Handling

- Use custom exceptions
- Handle all edge cases
- Return proper HTTP status codes
- Include error messages

### Logging

- Use structured logging
- Include proper context
- Log at appropriate levels
- Include request IDs

## Security

### Authentication

- Use JWT tokens
- Implement proper password hashing
- Use secure session management
- Implement rate limiting

### Data Validation

- Use Pydantic models
- Validate all input data
- Sanitize user input
- Handle edge cases

## Testing

### Test Organization

- Use pytest
- Group tests by feature
- Use fixtures for common setup
- Include both positive and negative tests

### Test Structure

```python
def test_create_user_success():
    # Arrange
    user_data = UserCreate(...)

    # Act
    result = create_user(user_data)

    # Assert
    assert result.id is not None
    assert result.email == user_data.email
```

---

_Note: These rules should be followed for all new code. Existing code should be updated to follow these rules when modified._
