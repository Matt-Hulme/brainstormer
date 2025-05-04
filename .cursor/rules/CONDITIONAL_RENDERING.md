# Conditional Rendering Rules

## Prefer `&&` over Ternary Operators

When rendering UI conditionally in React components, prefer using the logical AND (`&&`) operator instead of ternary operators where possible.

### Preferred:

```jsx
{
  condition && <Component />
}
{
  !condition && <AlternativeComponent />
}
```

### Avoid:

```jsx
{
  condition ? <Component /> : <AlternativeComponent />
}
```

### Reasoning:

- More readable for simple conditionals
- Easier to follow logical flow
- Reduces nesting
- More explicit about each condition

### Exceptions:

- When you need to render different values of the same prop conditionally
- When dealing with non-JSX values
- For complex inline conditions that need to return different primitive values

## Multiple Conditions

For multiple mutually exclusive conditions:

### Preferred:

```jsx
{
  conditionA && <ComponentA />
}
{
  conditionB && <ComponentB />
}
{
  !(conditionA || conditionB) && <FallbackComponent />
}
```

### Avoid:

```jsx
{
  conditionA ? (
    <ComponentA />
  ) : conditionB ? (
    <ComponentB />
  ) : (
    <FallbackComponent />
  )
}
```

## Inline Conditions

For simple text or attribute conditionals where a ternary might be unavoidable:

```jsx
<div className={`base-class ${isActive && 'active-class'}`}>
  {text || 'Default text'}
</div>
```
