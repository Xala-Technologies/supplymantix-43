
# Clean Code Refactoring Guidelines

This document outlines the standards and practices for maintaining clean, maintainable, and scalable code throughout the application.

---

## 🎯 CORE PRINCIPLES

### 1. Single Responsibility Principle
- Each component should have one clear purpose
- Break down large components into smaller, focused ones
- Separate business logic from presentation logic

### 2. DRY (Don't Repeat Yourself)
- Extract common patterns into reusable components
- Create utility functions for repeated logic
- Use custom hooks for shared state management

### 3. Composition Over Inheritance
- Favor component composition over complex inheritance hierarchies
- Use higher-order components and render props sparingly
- Leverage React's built-in composition patterns

---

## 📁 FILE STRUCTURE STANDARDS

### Component Organization
```
/components
  /ui (shadcn/ui components)
  /layout (layout components)
  /feature-name
    /components
    /hooks
    /types
    /utils
    index.ts
```

### File Naming Conventions
- Components: `PascalCase` (e.g., `WorkOrderCard.tsx`)
- Hooks: `camelCase` starting with `use` (e.g., `useWorkOrders.ts`)
- Utilities: `camelCase` (e.g., `formatDate.ts`)
- Types: `PascalCase` with descriptive names (e.g., `WorkOrderStatus`)

---

## 🔧 COMPONENT STANDARDS

### Component Structure
```typescript
// 1. Imports (grouped and ordered)
import React from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// 2. Types/Interfaces
interface ComponentProps {
  // Define props here
}

// 3. Component Definition
export const Component = ({ prop1, prop2 }: ComponentProps) => {
  // 4. State and hooks
  const [state, setState] = useState();
  
  // 5. Event handlers
  const handleClick = () => {
    // Handle click
  };
  
  // 6. Render
  return (
    <div>
      {/* Component JSX */}
    </div>
  );
};
```

### Props and State Management
- Use TypeScript interfaces for all props
- Prefer `const` assertions for static data
- Use custom hooks for complex state logic
- Implement proper error boundaries

---

## 🚀 PERFORMANCE GUIDELINES

### React Optimization
- Use `React.memo()` for expensive components
- Implement `useMemo()` and `useCallback()` judiciously
- Avoid inline functions in JSX when possible
- Use `Suspense` for code splitting

### Bundle Optimization
- Lazy load routes and heavy components
- Tree-shake unused imports
- Optimize images and assets
- Use dynamic imports for large libraries

---

## 🧪 TESTING STANDARDS

### Unit Testing
- Test components in isolation
- Mock external dependencies
- Test user interactions, not implementation details
- Maintain high test coverage for critical paths

### Integration Testing
- Test component integration
- Test API integration
- Test routing and navigation
- Test error handling

---

## 🔍 CODE QUALITY TOOLS

### ESLint Rules
- Enforce consistent formatting
- Catch potential bugs
- Ensure TypeScript best practices
- Maintain import order

### TypeScript Standards
- Use strict mode
- Define proper types for all data
- Avoid `any` type
- Use union types and generics appropriately

---

## 📝 DOCUMENTATION REQUIREMENTS

### Component Documentation
- Include JSDoc comments for complex components
- Document prop types and their purposes
- Provide usage examples
- Document any side effects or dependencies

### Code Comments
- Explain complex logic, not obvious code
- Use TODO comments for technical debt
- Document workarounds and their reasons
- Keep comments up-to-date with code changes

---

## 🚫 ANTI-PATTERNS TO AVOID

### Common Mistakes
- Large, monolithic components (>200 lines)
- Inline styles (use Tailwind classes)
- Deeply nested prop drilling
- Mixing business logic with UI logic
- Inconsistent naming conventions
- Unused imports and variables

### Performance Anti-Patterns
- Creating objects/functions in render
- Not memoizing expensive calculations
- Excessive re-renders
- Large bundle sizes
- Unoptimized images

---

## ✅ REFACTORING CHECKLIST

Before committing code changes:
- [ ] Component is under 200 lines
- [ ] Single responsibility principle followed
- [ ] Proper TypeScript types defined
- [ ] No console logs or debug code
- [ ] Tests updated/added
- [ ] Documentation updated
- [ ] Performance implications considered
- [ ] Accessibility requirements met
