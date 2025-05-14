---
description: 
globs: 
alwaysApply: true
---
# Security Practices

## Never Compromise Security

Security should be treated as a first-class concern at all stages of development, including local development environments, but especially stg/prod. The habits formed during development directly impact production security.

### Key Principles:

1. **Use Real Security Controls**: Never disable authentication, authorization, or encryption mechanisms during local development.

2. **No Hardcoded Credentials**: Avoid hardcoding sensitive credentials in the codebase. Use environment variables or secure vaults instead.

3. **Proper Secret Management**: 
   - Use `.env` files for local secrets (ensure they're in `.gitignore`)
   - Never commit API keys, tokens, or passwords to version control
   - Consider using a secrets management solution

4. **Input Validation Everywhere**: Always validate and sanitize inputs, even during local development.

5. **HTTPS Locally**: Use HTTPS with valid certificates even in local environments.

6. **Follow Least Privilege**: Applications and services should only have access to the resources they absolutely need.

7. **Security Headers**: Implement proper security headers in all environments.

8. **Regular Dependency Updates**: Keep dependencies up-to-date to avoid known vulnerabilities.

### Remember:
Security vulnerabilities introduced during development often make their way to production. Maintaining consistent security practices across all environments is essential for building secure applications.

