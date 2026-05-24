# Ralph Loop CLI Implementation Project Plan

## Meta
- **Title:** Ralph Loop CLI Implementation
- **Scope:** Build a TypeScript CLI tool that consumes PRD YAML and orchestrates the Ralph Loop with robust progress tracking, effort-based task routing, feedback integration, and safety features.
- **Non-goals:** Build UI components, Integrate with external CI/CD pipelines initially
- **Assumptions:** Node.js and TypeScript environment, Local execution of lint/test/typecheck commands, PRD YAML follows defined schema

---

## Tasks

### 1. Define PRD YAML schema and TypeScript interfaces
- **Description:** Formalize the Ralph Loop PRD input schema with detailed task result entries and create corresponding TypeScript interfaces.
- **Acceptance Criteria:**
  - All required fields and types covered
  - Results array supports detailed status and feedback info
  - Interfaces align with project design
- **Effort:** Low (0)
- **Dependencies:** None

---

### 2. Implement PRD YAML parsing and validation
- **Description:** Use a YAML parser and runtime validation (e.g. zod) to parse PRD YAML files and validate their structure against the defined interfaces.
- **Acceptance Criteria:**
  - Function `parseAndValidatePRD` parses valid PRD YAML correctly
  - Throws on invalid or malformed input with clear errors
  - Covered by unit tests with valid and invalid samples
- **Effort:** Medium (1)
- **Dependencies:** Define PRD YAML schema and TypeScript interfaces (Task 1)

---

### 3. Build CLI entrypoint for Ralph Loop tool
- **Description:** Create CLI interface that accepts PRD YAML path, optional progress file, and configuration options. Integrate PRD parsing and validation.
- **Acceptance Criteria:**
  - CLI accepts and parses PRD YAML file
  - Exits with error for invalid inputs
  - Logs successful parsing and initial status
  - Covered by CLI integration and unit tests
- **Effort:** Medium (1)
- **Dependencies:** Implement PRD YAML parsing and validation (Task 2)

---

### 4. Implement progress file loading, updating, and saving
- **Description:** Use JSON format to keep track of task results across loop iterations, support incremental updates and persistence.
- **Acceptance Criteria:**
  - Load existing or create new progress file
  - Update progress with task results correctly
  - Save progress atomically
  - Covered by unit tests
- **Effort:** Medium (1)
- **Dependencies:** Build CLI entrypoint for Ralph Loop tool (Task 3)

---

### 5. Implement task picking logic and effort-based agent routing
- **Description:** Select first unpassed task, map effort to agent model or mode, expose interface for loop runner to invoke agent commands accordingly.
- **Acceptance Criteria:**
  - Correctly picks next task based on progress
  - Maps effort value to predefined agent settings
  - Returns clear routing info per task
  - Covered by unit tests
- **Effort:** Medium (1)
- **Dependencies:** Implement progress tracking (Task 4)

---

### 6. Implement feedback checks (tests, lint, typecheck) integration
- **Description:** Run feedback commands locally after task implementation to validate changes, interpret results for progress update.
- **Acceptance Criteria:**
  - Feedback commands configurable and runnable
  - Results are parsed to update task result feedback_passed fields
  - Fail conditions detected and handled
  - Covered by integration and unit tests with mocks
- **Effort:** High (2)
- **Dependencies:** Implement task picking and routing (Task 5)

---

### 7. Implement main loop runner with iteration and safety guards
- **Description:** Drive the Ralph Loop cycle: select task, invoke agent with routing, run feedback, update progress, observe iteration limits and stop conditions.
- **Acceptance Criteria:**
  - Loop runs until all tasks pass or max iterations reached
  - Stops on repeated failure patterns
  - Logs each iteration status
  - Covered by integration and unit tests
- **Effort:** High (2)
- **Dependencies:** Implement feedback integration (Task 6)

---

### 8. Implement detailed logging and console output
- **Description:** Produce user-friendly logs and summaries of each loop iteration and task results for CLI visibility.
- **Acceptance Criteria:**
  - Logs include task id, status, agent model, feedback results
  - Errors and warnings clearly indicated
  - Covered by unit and integration tests
- **Effort:** Low (0)
- **Dependencies:** Implement loop runner (Task 7)

---
