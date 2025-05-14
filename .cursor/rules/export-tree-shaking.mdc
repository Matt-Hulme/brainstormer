---
description: 
globs: 
alwaysApply: true
---
# Export Rules for Tree-Shaking

## Avoid Barrel Files

Do not create barrel files that re-export multiple components together. Barrel files typically look like this:

```typescript
// DO NOT DO THIS
export * from './Component1';
export * from './Component2';
export * from './Component3';
```

## Proper index.ts Export Pattern

Each component should be in its own file with a proper named export. The `index.ts` file should individually export components to ensure tree-shaking works correctly:

```typescript
// CORRECT APPROACH
export { Component1 } from './Component1';
export { Component2 } from './Component2';
export { Component3 } from './Component3';
```

## Benefits of This Approach

1. **Better Tree-Shaking**: When using wildcard exports (`export *`), bundlers may struggle to properly tree-shake unused components
2. **Smaller Bundle Size**: Proper named exports allow bundlers to only include what's actually used
3. **Clear Component Dependencies**: Makes it easier to track which components are actually used in the application
4. **Faster Build Times**: More efficient compilation due to clearer dependency graph

## Example Component Structure

```
components/
  |- Button/
     |- Button.tsx       // Component implementation
     |- Button.test.tsx  // Component tests
     |- index.ts         // Exports just the Button component
  |- Card/
     |- Card.tsx         // Component implementation
     |- Card.test.tsx    // Component tests
     |- index.ts         // Exports just the Card component
  |- index.ts            // Exports individual components, not using wildcards
```

In the top-level `index.ts`:

```typescript
export { Button } from './Button';
export { Card } from './Card';
// Not using: export * from './Button';
```

