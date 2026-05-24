# Super Off Road - Master Implementation Plan

A unified roadmap for building the Ralph Loop iterative agent-driven development skill.

---

## Meta
- **Title:** Super Off Road Implementation
- **Scope:** Build a TypeScript CLI tool that consumes PRD YAML, orchestrates the Ralph Loop with progress tracking, effort-based routing, feedback integration, and safety features.
- **Non-goals:** UI components, external CI/CD pipeline integration (initially)
- **Assumptions:** Node.js + TypeScript environment, local command execution, PRD YAML follows defined schema

---

## Phase 1: Foundation

### 1.1 Define PRD YAML Schema and TypeScript Interfaces
- **Description:** Formalize the Ralph Loop PRD input schema with detailed task result entries and create corresponding TypeScript interfaces.
- **Acceptance Criteria:**
  - All required fields and types covered
  - Results array supports detailed status and feedback info
  - Interfaces align with project design
- **Effort:** Low (0)
- **Dependencies:** None

### 1.2 Implement PRD YAML Parsing and Validation
- **Description:** Use a YAML parser (js-yaml) and runtime validation (zod) to parse PRD YAML files and validate their structure.
- **Acceptance Criteria:**
  - Function `parseAndValidatePRD` parses valid PRD YAML correctly
  - Throws on invalid/malformed input with clear errors
  - Covered by unit tests with valid and invalid samples
- **Effort:** Medium (1)
- **Dependencies:** Task 1.1

---

## Phase 2: Core CLI and Progress Tracking

### 2.1 Build CLI Entry Point
- **Description:** Create CLI interface accepting PRD YAML path, optional progress file, and configuration options. Integrate PRD parsing/validation.
- **Acceptance Criteria:**
  - CLI accepts and parses PRD YAML file
  - Exits with error for invalid inputs
  - Logs successful parsing and initial status
  - Covered by CLI integration and unit tests
- **Effort:** Medium (1)
- **Dependencies:** Task 1.2

### 2.2 Implement Progress File Management
- **Description:** Use JSON format to track task results across loop iterations, supporting incremental updates and persistence.
- **Acceptance Criteria:**
  - Load existing or create new progress file
  - Update progress with task results correctly
  - Save progress atomically
  - Covered by unit tests
- **Effort:** Medium (1)
- **Dependencies:** Task 2.1

---

## Phase 3: Task Execution and Routing

### 3.1 Implement Task Selection and Effort-Based Routing
- **Description:** Select first unpassed task, map effort to agent model/mode, expose interface for loop runner to invoke agent commands.
- **Acceptance Criteria:**
  - Correctly picks next task based on progress
  - Maps effort value to predefined agent settings
  - Returns clear routing info per task
  - Covered by unit tests
- **Effort:** Medium (1)
- **Dependencies:** Task 2.2

### 3.2 Implement Feedback Checks Integration
- **Description:** Run feedback commands (tests, lint, typecheck) locally after task implementation to validate changes, interpret results for progress updates.
- **Acceptance Criteria:**
  - Feedback commands configurable and runnable
  - Results parsed to update task result feedback_passed fields
  - Fail conditions detected and handled
  - Covered by integration and unit tests with mocks
- **Effort:** High (2)
- **Dependencies:** Task 3.1

---

## Phase 4: Loop Orchestration and Polish

### 4.1 Implement Main Loop Runner with Safety Guards
- **Description:** Drive the Ralph Loop cycle: select task, invoke agent with routing, run feedback, update progress, observe iteration limits and stop conditions.
- **Acceptance Criteria:**
  - Loop runs until all tasks pass or max iterations reached
  - Stops on repeated failure patterns
  - Logs each iteration status
  - Covered by integration and unit tests
- **Effort:** High (2)
- **Dependencies:** Task 3.2

### 4.2 Implement Detailed Logging and Console Output
- **Description:** Produce user-friendly logs and summaries of each loop iteration and task results for CLI visibility.
- **Acceptance Criteria:**
  - Logs include task id, status, agent model, feedback results
  - Errors and warnings clearly indicated
  - Covered by unit and integration tests
- **Effort:** Low (0)
- **Dependencies:** Task 4.1

---

## Effort Summary

| Phase | Tasks | Total Effort |
|-------|-------|--------------|
| Phase 1: Foundation | 1.1, 1.2 | 1 |
| Phase 2: CLI + Progress | 2.1, 2.2 | 2 |
| Phase 3: Execution + Routing | 3.1, 3.2 | 3 |
| Phase 4: Loop + Polish | 4.1, 4.2 | 2 |
| **Total** | **8 tasks** | **8** |

---

## Implementation Notes

1. **Sequential Execution:** Tasks within each phase should be completed in order; phases build on prior work.
2. **Testing:** Each task requires unit tests; integration tests for cross-component tasks (2.2, 3.2, 4.1).
3. **Progress File:** Keep progress tracking separate from PRD source of truth to avoid overwriting user requirements.
4. **Safety:** Build iteration limits and failure pattern detection early in Phase 4.

---

## Next Step

Begin with **Task 1.1: Define PRD YAML Schema and TypeScript Interfaces**. This establishes the contract for all downstream work.
