# Super Off Road

An iterative agent-driven development skill inspired by the Ralph Loop. Uses a lap-based analogy for the loop cycle to track progress on PRD.yml tasks.

## Quick Start

```bash
npm install
npm run build
node dist/cli.js
```

## PRD.yml Structure

The PRD file defines tasks for iterative development:

```yaml
title: "Project Name"
description: "Project description"
createdAt: "2024-01-15T10:30:00Z"
tasks:
  - id: "task-1"
    title: "Task title"
    description: "Task description"
    effort: low|medium|high|expert  # optional, defaults to "medium"
    acceptanceCriteria:
      - "Criterion 1"
      - "Criterion 2"
    result:
      status: pending|in-progress|passed|failed  # defaults to "pending"
      errors: []
```

## API Usage

### Parse and Validate PRD

```typescript
import { parsePRD } from "./src/prd-parser";

const yaml = `
title: My Project
description: A test project
tasks:
  - id: task-1
    title: Setup
    description: Initialize project
`;

const prd = parsePRD(yaml);
console.log(prd.tasks[0].title); // "Setup"
```

### Validate Without Parsing

```typescript
import { validatePRD } from "./src/prd-parser";

try {
  const prd = validatePRD(yamlString);
} catch (error) {
  console.error(error.message);
}
```

## Project Structure

```
src/
  index.ts          # Main exports
  prd.types.ts      # TypeScript types and Zod schemas
  prd-parser.ts     # PRD parsing and validation logic
  cli.ts            # Command-line interface
test/
  prd-parser.test.ts  # Unit tests
prd.yml             # Sample PRD file
```

## Scripts

- `npm run build` - Compile TypeScript
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
