# Shared Rules

These rules apply to both frontend and backend code.

## Project Structure

```
project/
├── frontend/          # React frontend application
├── backend/           # FastAPI backend application
└── .cursor/          # Project configuration and rules
```

## File Naming

### General Rules

- Use descriptive, meaningful names
- Avoid abbreviations unless widely known
- Keep file names concise but clear
- Use appropriate case for your language (PascalCase for React, snake_case for Python)

### Environment Files

- Use `.env` for local development
- Use `.env.example` as a template
- Never commit `.env` files
- Document all required environment variables

## Code Style

### General Rules

- Keep functions focused and single-responsibility
- Use meaningful variable and function names
- Comment complex logic
- Keep files under 300 lines when possible
- Use consistent indentation (2 spaces)

### Documentation

- Document public APIs
- Add comments for complex business logic
- Keep documentation up to date
- Use clear, concise language

## Git Practices

### Commits

- Write clear, descriptive commit messages
- Keep commits focused and atomic
- Use present tense in commit messages
- Reference issues when applicable

### Branches

- Use feature branches for new features
- Use bugfix branches for fixes
- Keep branches up to date with main
- Delete branches after merging

## Security

### General Rules

- Never commit sensitive data
- Use environment variables for secrets
- Follow security best practices
- Keep dependencies updated
- Use HTTPS in production

### Authentication

- Implement proper authentication
- Use secure password hashing
- Implement rate limiting
- Use secure session management

## Error Handling

### General Rules

- Handle errors gracefully
- Log errors appropriately
- Provide meaningful error messages
- Implement proper error recovery

## Performance

### General Rules

- Optimize database queries
- Implement proper caching
- Monitor performance
- Profile code when needed

---

_Note: These rules should be followed for all new code. Existing code should be updated to follow these rules when modified._
