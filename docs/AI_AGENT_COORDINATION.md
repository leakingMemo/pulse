# AI Agent Coordination Guide

## Overview

This guide enables multiple Claude agents to work simultaneously on different parts of the Pulse project without conflicts. Each issue is designed to be self-contained with clear boundaries.

## Agent Assignment Matrix

### Foundation Sprint (Can run in parallel)

| Issue | Agent Focus | Dependencies | Isolation Level |
|-------|------------|--------------|-----------------|
| #2 Dev Environment | Configuration | None | High - Only touches config files |
| #3 Type System | TypeScript Types | None | High - Only creates type files |
| #4 Database Layer | SQLite/Data | Types (#3) | High - Isolated to lib/db |
| #5 Security | Keychain/Crypto | None | High - Isolated to lib/security |

### Dashboard Sprint (Sequential dependencies)

| Issue | Agent Focus | Dependencies | Isolation Level |
|-------|------------|--------------|-----------------|
| #6 Dashboard Layout | UI Framework | Types (#3) | Medium - Creates base components |
| #7 Service Layer | Business Logic | Types (#3) | High - Isolated to services/ |
| #8 Performance | Optimization | All above | Low - Touches multiple areas |

## Agent Starting Messages

### Agent 1: Development Environment (#2)
```
You are working on issue #2 for the Pulse project - a Raycast extension for personal dashboard.

CONTEXT:
- Working in: /Users/nathandsouza/git/Pulse
- Branch: feature/issue-1-initial-setup
- Your focus: Development environment setup ONLY

YOUR SCOPE:
- ESLint and Prettier configuration
- TypeScript path configuration
- Pre-commit hooks with husky
- VS Code workspace settings
- Development scripts

DO NOT TOUCH:
- Any source code in src/
- Type definitions
- Database or security code

START BY:
1. Read package.json to understand current setup
2. Install missing dev dependencies
3. Create config files in project root

DELIVERABLES:
- .eslintrc.js with Raycast standards
- .prettierrc with consistent formatting
- tsconfig paths for @/ imports
- .husky pre-commit hooks
- npm scripts for dev workflow
```

### Agent 2: Type System (#3)
```
You are working on issue #3 for the Pulse project - a Raycast extension for personal dashboard.

CONTEXT:
- Working in: /Users/nathandsouza/git/Pulse
- Branch: feature/issue-1-initial-setup
- Your focus: Type definitions ONLY

YOUR SCOPE:
- Create all TypeScript interfaces and types
- Work ONLY in src/types/ directory
- No implementation code, just type definitions

STRUCTURE TO CREATE:
src/types/
├── domain/
│   ├── finance.ts    (Account, Transaction, Balance)
│   ├── health.ts     (Exercise, Nutrition, Metrics)
│   ├── tasks.ts      (Task, Project, Priority)
│   └── habits.ts     (Habit, Streak, Progress)
├── api/
│   ├── notion.ts     (NotionResponse types)
│   ├── banking.ts    (PlaidAccount, etc)
│   └── health-kit.ts (HealthData types)
└── ui/
    └── components.ts (Props for all components)

START BY:
1. Create the directory structure
2. Define core domain types first
3. Add comprehensive JSDoc comments
4. Export everything from index files

DELIVERABLES:
- Complete type system
- All types exported properly
- JSDoc documentation
- No 'any' types
```

### Agent 3: Database Layer (#4)
```
You are working on issue #4 for the Pulse project - a Raycast extension for personal dashboard.

CONTEXT:
- Working in: /Users/nathandsouza/git/Pulse
- Branch: feature/issue-1-initial-setup
- Your focus: Database layer ONLY

YOUR SCOPE:
- Work ONLY in src/lib/db/ directory
- Implement SQLite with better-sqlite3
- Create repository pattern
- Database migrations

DEPENDENCIES:
- Use types from src/types/domain/* (Agent 2's work)
- Don't modify types, just import them

STRUCTURE TO CREATE:
src/lib/db/
├── connection.ts     (Database connection)
├── migrations/       (SQL migration files)
├── repositories/     (Repository pattern)
│   ├── base.repository.ts
│   ├── finance.repository.ts
│   ├── health.repository.ts
│   ├── tasks.repository.ts
│   └── habits.repository.ts
└── index.ts         (Exports)

START BY:
1. Install better-sqlite3
2. Create connection manager
3. Design schema based on types
4. Implement base repository

DELIVERABLES:
- Working SQLite database
- Repository pattern for all entities
- Migration system
- Connection pooling
```

### Agent 4: Security Infrastructure (#5)
```
You are working on issue #5 for the Pulse project - a Raycast extension for personal dashboard.

CONTEXT:
- Working in: /Users/nathandsouza/git/Pulse
- Branch: feature/issue-1-initial-setup
- Your focus: Security infrastructure ONLY

YOUR SCOPE:
- Work ONLY in src/lib/security/ directory
- macOS Keychain integration
- Encryption utilities
- No UI or business logic

STRUCTURE TO CREATE:
src/lib/security/
├── keychain.ts      (KeychainManager class)
├── encryption.ts    (Crypto utilities)
├── constants.ts     (Security constants)
├── audit.ts         (Access logging)
└── index.ts        (Exports)

START BY:
1. Research Raycast Keychain API
2. Create KeychainManager class
3. Implement secure storage methods
4. Add comprehensive error handling

DELIVERABLES:
- KeychainManager with store/retrieve/delete
- Encryption/decryption utilities
- Security best practices
- Comprehensive tests

DO NOT:
- Store any actual credentials
- Modify other parts of codebase
- Create UI components
```

### Agent 5: Basic Dashboard Layout (#6)
```
You are working on issue #6 for the Pulse project - a Raycast extension for personal dashboard.

CONTEXT:
- Working in: /Users/nathandsouza/git/Pulse
- Branch: feature/issue-1-initial-setup
- Your focus: Dashboard layout ONLY

YOUR SCOPE:
- Update src/dashboard.tsx
- Create layout components in src/components/layout/
- Use Raycast Grid API
- Create loading/error states

DEPENDENCIES:
- Import types from src/types/ui/* (Agent 2's work)
- Don't implement data fetching yet

STRUCTURE TO UPDATE:
src/
├── dashboard.tsx (Update existing)
└── components/
    └── layout/
        ├── DashboardGrid.tsx
        ├── SectionContainer.tsx
        ├── LoadingState.tsx
        └── ErrorBoundary.tsx

START BY:
1. Read existing dashboard.tsx
2. Study Raycast Grid documentation
3. Create responsive grid layout
4. Add keyboard navigation

DELIVERABLES:
- Working F4 hotkey binding
- Grid with 4 sections
- Loading states for each section
- Error boundaries
- Keyboard navigation
```

### Agent 6: Service Layer Architecture (#7)
```
You are working on issue #7 for the Pulse project - a Raycast extension for personal dashboard.

CONTEXT:
- Working in: /Users/nathandsouza/git/Pulse
- Branch: feature/issue-1-initial-setup
- Your focus: Service architecture ONLY

YOUR SCOPE:
- Work ONLY in src/services/ directory
- Create service abstractions
- Implement dependency injection
- No UI components

DEPENDENCIES:
- Import types from src/types/domain/* (Agent 2's work)
- Import repositories from src/lib/db/* (Agent 3's work)

STRUCTURE TO CREATE:
src/services/
├── base.service.ts       (Abstract base)
├── registry.ts           (DI container)
├── dashboard/
│   └── dashboard.service.ts
├── finance/
│   └── finance.service.ts
├── health/
│   └── health.service.ts
├── tasks/
│   └── tasks.service.ts
└── habits/
    └── habits.service.ts

START BY:
1. Create BaseService abstract class
2. Implement service registry
3. Create service interfaces
4. Wire up dependency injection

DELIVERABLES:
- Complete service layer
- Dependency injection working
- Clean service interfaces
- Testable architecture
```

## Coordination Rules

### 1. File Ownership
- Each agent owns specific directories
- No agent modifies another's files
- Shared files (package.json) require coordination

### 2. Import Rules
- Agents can import from completed work
- Never modify imported files
- Use type imports for interfaces

### 3. Communication Protocol
```typescript
// When creating a public API, add this header:
/**
 * PUBLIC API - Used by: Agent X, Agent Y
 * Do not modify signature without coordination
 */
```

### 4. Conflict Resolution
- If you need to modify shared files:
  1. Check if another agent owns it
  2. Create a TODO comment
  3. Report in issue comments

### 5. Testing Boundaries
- Each agent tests their own code
- Mock external dependencies
- Don't test other agents' code

## Parallel Execution Strategy

### Phase 1: Pure Parallel (No dependencies)
```bash
# Can run simultaneously:
Agent 1: npm install && create configs
Agent 2: mkdir -p src/types && create types  
Agent 4: mkdir -p src/lib/security && implement
```

### Phase 2: Light Dependencies
```bash
# After Agent 2 completes types:
Agent 3: implement database using types
Agent 5: implement UI using types
Agent 6: implement services using types
```

### Phase 3: Integration
```bash
# After all complete:
Agent 7: Wire everything together
Agent 8: Performance optimization
```

## Success Criteria Per Agent

### Must Have:
- [ ] All files in assigned directory created
- [ ] All tests passing
- [ ] No modifications outside scope
- [ ] Clear API documentation
- [ ] Error handling implemented

### Nice to Have:
- [ ] Performance benchmarks
- [ ] Usage examples
- [ ] Integration test stubs

## Common Pitfalls to Avoid

1. **Import Cycles**: Always import down the hierarchy
2. **Scope Creep**: Stay in your assigned directories
3. **Breaking Changes**: Don't modify existing APIs
4. **Missing Types**: Wait for Agent 2 if you need types
5. **Premature Integration**: Focus on your module first

## Git Workflow for Agents

Each agent should:
1. Create a sub-branch: `feature/issue-1-initial-setup-part-X`
2. Commit frequently with clear messages
3. Push to avoid conflicts
4. Create draft PR early
5. Mark PR ready when complete

## Example Coordination

```
Agent 2: "I've completed all type definitions in src/types/"
Agent 3: "Thanks, I'm now importing from types/domain/ for repositories"
Agent 5: "I'm using types/ui/ for component props"
Agent 6: "Services are importing types/domain/ for business logic"
```

## Final Integration Checklist

When all agents complete:
- [ ] All imports resolve correctly
- [ ] No circular dependencies
- [ ] All tests pass
- [ ] Types are consistent
- [ ] Performance targets met
- [ ] Documentation complete