# AI-Assisted Development Guide for Pulse

## Overview

This guide outlines best practices for developing Pulse with AI assistants (GitHub Copilot, Claude, ChatGPT, etc.). The codebase is structured to maximize AI effectiveness while maintaining code quality.

## Core Principles

### 1. Context is King
- Keep files small and focused (< 200 lines)
- Use descriptive names that explain purpose
- Include JSDoc comments for complex logic
- Maintain a clear dependency graph

### 2. Type Everything
```typescript
// ❌ Bad - AI can't infer types
const processData = (data) => {
  return data.map(item => item.value);
};

// ✅ Good - AI knows exactly what to generate
interface DataItem {
  id: string;
  value: number;
  timestamp: Date;
}

const processData = (data: DataItem[]): number[] => {
  return data.map(item => item.value);
};
```

### 3. Predictable Patterns

#### Service Pattern
```typescript
// services/[feature]/[feature].service.ts
export class FeatureService {
  constructor(private deps: Dependencies) {}
  
  async getData(): Promise<FeatureData> {}
  async updateData(data: Partial<FeatureData>): Promise<void> {}
}
```

#### Component Pattern
```typescript
// components/[feature]/[feature].component.tsx
interface FeatureProps {
  data: FeatureData;
  onAction: (action: Action) => void;
}

export function Feature({ data, onAction }: FeatureProps) {
  return <View>{/* implementation */}</View>;
}
```

## AI Workflow Patterns

### 1. Feature Development Flow

```bash
# 1. Generate types first
"Create TypeScript interfaces for a finance tracking feature"

# 2. Generate service layer
"Implement FinanceService using the interfaces"

# 3. Generate components
"Create FinanceSection component using the service"

# 4. Generate tests
"Write tests for FinanceService"
```

### 2. Refactoring Flow

```bash
# 1. Identify boundaries
"List all dependencies of BalanceCalculator"

# 2. Extract interface
"Extract interface from BalanceCalculator class"

# 3. Refactor implementation
"Refactor BalanceCalculator to use dependency injection"

# 4. Update tests
"Update tests to use mock dependencies"
```

### 3. Debugging Flow

```bash
# 1. Reproduce issue
"Write a test that reproduces the balance calculation bug"

# 2. Diagnose problem
"Analyze why calculateTotal returns NaN for empty arrays"

# 3. Fix implementation
"Fix calculateTotal to handle edge cases"

# 4. Verify fix
"Verify all tests pass including edge cases"
```

## Code Organization for AI

### Directory Naming Convention

```
src/
├── commands/        # Entry points - AI starts here
├── services/        # Business logic - AI implements here
├── components/      # UI elements - AI composes here
├── integrations/    # External APIs - AI wraps here
├── lib/            # Utilities - AI reuses here
└── types/          # Contracts - AI references here
```

### File Naming Convention

```
[feature]-[type].[ext]
balance-calculator.service.ts
finance-section.component.tsx
account.interface.ts
format-currency.util.ts
```

### Import Organization

```typescript
// 1. External imports
import { List } from "@raycast/api";
import { useState } from "react";

// 2. Absolute imports (from src/)
import { FinanceService } from "@/services/finance";
import { Account } from "@/types/domain";

// 3. Relative imports (same feature)
import { BalanceChart } from "./balance-chart";
import { formatCurrency } from "./utils";
```

## AI Prompt Templates

### Creating a New Feature

```
Create a [feature] for Pulse that:
1. Integrates with [data source]
2. Shows [metrics]
3. Allows users to [actions]

Follow the existing patterns:
- Service in services/[feature]/
- Types in types/domain/[feature].ts
- Component in components/sections/
- Tests alongside implementation
```

### Adding an Integration

```
Add [service] integration to Pulse:
1. Create client in integrations/[service]/
2. Use existing patterns from integrations/notion/
3. Store credentials in KeychainManager
4. Add types in types/api/[service].ts
5. Handle errors gracefully
```

### Implementing a Command

```
Implement a Raycast command for [action]:
1. Create command in commands/[command].tsx
2. Use existing services
3. Follow Raycast UI patterns
4. Add loading and error states
5. Include keyboard shortcuts
```

## Testing with AI

### Test Generation Prompts

```
Generate tests for [Module]:
1. Unit tests for pure functions
2. Integration tests for services
3. Mock external dependencies
4. Test error cases
5. Test edge cases
```

### Test Patterns

```typescript
// Always use descriptive test names
describe('FinanceService', () => {
  describe('calculateBalance', () => {
    it('should sum all account balances', () => {});
    it('should handle empty account list', () => {});
    it('should ignore closed accounts', () => {});
    it('should convert currencies', () => {});
  });
});
```

## Common AI Tasks

### 1. Adding a New Dashboard Section

```bash
# Prompt
"Add a Crypto portfolio section to the dashboard following the existing pattern. 
It should show total value, 24h change, and top holdings."

# AI will:
1. Create types/domain/crypto.ts
2. Create services/crypto/crypto.service.ts
3. Create components/sections/crypto-section.tsx
4. Update dashboard.tsx to include section
```

### 2. Implementing Background Sync

```bash
# Prompt
"Implement background sync for finance data that runs every 5 minutes.
Use the existing sync patterns and queue system."

# AI will:
1. Create services/sync/finance-sync.ts
2. Add job to queue configuration
3. Implement sync logic with error handling
4. Add sync status to UI
```

### 3. Adding a Quick Action

```bash
# Prompt
"Add a quick action to log water intake. 
User types 'water 250ml' and it logs to health data."

# AI will:
1. Create commands/quick-log-water.tsx
2. Parse natural language input
3. Update health service
4. Show confirmation toast
```

## Performance Optimization with AI

### Optimization Prompts

```bash
# Analyze performance
"Identify performance bottlenecks in DashboardService"

# Optimize rendering
"Add memoization to FinanceSection component"

# Optimize data fetching
"Implement caching for getAccountBalances"

# Optimize bundle size
"Identify and remove unused dependencies"
```

## Error Handling Patterns

### Consistent Error Types

```typescript
// types/errors.ts
export class IntegrationError extends Error {
  constructor(
    public service: string,
    public code: string,
    message: string
  ) {
    super(message);
  }
}
```

### Error Recovery Prompts

```bash
"Implement retry logic for failed API calls in NotionService"
"Add offline support for dashboard when APIs are unavailable"
"Create user-friendly error messages for common failures"
```

## Code Review with AI

### Review Prompts

```bash
# Security review
"Review this code for security vulnerabilities"

# Performance review
"Identify performance issues in this implementation"

# Best practices
"Suggest improvements following TypeScript best practices"

# Accessibility
"Review this component for accessibility issues"
```

## Debugging with AI

### Debug Prompts

```bash
# Understand issue
"Explain why this balance calculation returns negative values"

# Find root cause
"Trace through the data flow to find where the type mismatch occurs"

# Fix suggestion
"Suggest a fix that maintains backward compatibility"
```

## Documentation with AI

### Documentation Prompts

```bash
# API documentation
"Generate JSDoc comments for all public methods in FinanceService"

# README updates
"Update README with new quick-log commands"

# Type documentation
"Add comprehensive comments to the DashboardData interface"
```

## CI/CD Integration

### GitHub Actions Prompts

```bash
"Create a GitHub Action that:
1. Runs tests on PR
2. Checks TypeScript types
3. Runs linter
4. Builds extension
5. Comments coverage report"
```

## Best Practices Summary

1. **Keep context clear** - AI works best with well-defined boundaries
2. **Use types extensively** - Types guide AI to generate correct code
3. **Follow patterns** - Consistent patterns improve AI suggestions
4. **Test everything** - AI can generate comprehensive tests easily
5. **Document intent** - Comments help AI understand complex logic
6. **Modularize aggressively** - Small modules are easier for AI to work with
7. **Name descriptively** - Good names eliminate need for comments
8. **Handle errors consistently** - Patterns make AI error handling predictable

## Conclusion

By following these patterns and practices, AI assistants can effectively contribute to Pulse development, maintaining high code quality while accelerating development velocity. The key is providing clear context and maintaining consistent patterns throughout the codebase.