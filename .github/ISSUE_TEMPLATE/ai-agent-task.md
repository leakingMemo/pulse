---
name: AI Agent Task
about: Template for AI agent-friendly issues
title: '[AGENT] '
labels: ai-ready
---

## 🤖 AI Agent Instructions

### Quick Start
```
You are working on issue #X for the Pulse project - a Raycast extension for personal dashboard.

CONTEXT:
- Working in: /Users/nathandsouza/git/Pulse
- Branch: feature/issue-X-description
- Your focus: [SPECIFIC FOCUS]

YOUR SCOPE:
- Work ONLY in: [directories]
- Dependencies: [what you can import]
- Deliverables: [what to create]

DO NOT TOUCH:
- [List of off-limits areas]
```

### Your Mission
[Clear, specific description of what this agent should accomplish]

### File Structure to Create
```
[Show exact directory/file structure]
```

### Dependencies You Can Use
- [ ] Types from: `src/types/...` (if available)
- [ ] Utils from: `src/lib/...` (if available)
- [ ] Services from: `src/services/...` (if available)

### Step-by-Step Plan
1. First, check these files exist: [list]
2. Create directory structure
3. Implement [specific feature]
4. Add comprehensive tests
5. Update exports in index files

### Success Criteria
- [ ] All specified files created
- [ ] Tests coverage > 80%
- [ ] No TypeScript errors
- [ ] ESLint passes
- [ ] No modifications outside scope

### API Contract
```typescript
// If this creates a public API, document it here
export interface YourAPI {
  // methods other agents will use
}
```

### Example Usage
```typescript
// Show how other agents will use your code
import { YourAPI } from '@/your-module';
```

### Testing Requirements
- Unit tests for all public methods
- Mock external dependencies
- Test error cases
- Performance benchmarks if applicable

### Performance Targets
- Initialization: < Xms
- Method calls: < Xms
- Memory usage: < XMB

### Notes for Other Agents
[Any special instructions for agents that will use this code]