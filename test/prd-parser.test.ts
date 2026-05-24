import { describe, it, expect } from "vitest";
import { parsePRD, validatePRD } from "../src/prd-parser";

describe("parsePRD", () => {
  it("should parse valid PRD YAML", () => {
    const yaml = `
title: Test Project
description: A test project
tasks:
  - id: task-1
    title: Setup project
    description: Initialize the project
    effort: low
    acceptanceCriteria:
      - "Project initialized"
      - "Tests pass"
`;
    const result = parsePRD(yaml);

    expect(result.title).toBe("Test Project");
    expect(result.description).toBe("A test project");
    expect(result.tasks).toHaveLength(1);
    expect(result.tasks[0].id).toBe("task-1");
    expect(result.tasks[0].effort).toBe("low");
  });

  it("should set default effort to medium", () => {
    const yaml = `
title: Test
description: Test desc
tasks:
  - id: task-1
    title: Task
    description: Task desc
`;
    const result = parsePRD(yaml);
    expect(result.tasks[0].effort).toBe("medium");
  });

  it("should set default result status to pending", () => {
    const yaml = `
title: Test
description: Test desc
tasks:
  - id: task-1
    title: Task
    description: Task desc
`;
    const result = parsePRD(yaml);
    expect(result.tasks[0].result.status).toBe("pending");
  });

  it("should parse ISO 8601 dates", () => {
    const yaml = `
title: Test
description: Test desc
createdAt: "2024-01-15T10:30:00Z"
tasks:
  - id: task-1
    title: Task
    description: Task desc
`;
    const result = parsePRD(yaml);
    expect(result.createdAt).toBe("2024-01-15T10:30:00Z");
  });

  it("should handle empty acceptance criteria", () => {
    const yaml = `
title: Test
description: Test desc
tasks:
  - id: task-1
    title: Task
    description: Task desc
`;
    const result = parsePRD(yaml);
    expect(result.tasks[0].acceptanceCriteria).toEqual([]);
  });

  it("should handle task with existing result", () => {
    const yaml = `
title: Test
description: Test desc
tasks:
  - id: task-1
    title: Task
    description: Task desc
    result:
      status: passed
      errors: []
`;
    const result = parsePRD(yaml);
    expect(result.tasks[0].result.status).toBe("passed");
  });
});

describe("validatePRD", () => {
  it("should reject missing title", () => {
    const yaml = `
description: Test desc
tasks:
  - id: task-1
    title: Task
    description: Task desc
`;
    expect(() => validatePRD(yaml)).toThrow("title");
  });

  it("should reject missing description", () => {
    const yaml = `
title: Test
tasks:
  - id: task-1
    title: Task
    description: Task desc
`;
    expect(() => validatePRD(yaml)).toThrow("description");
  });

  it("should reject missing tasks", () => {
    const yaml = `
title: Test
description: Test desc
`;
    expect(() => validatePRD(yaml)).toThrow("tasks");
  });

  it("should reject empty tasks array", () => {
    const yaml = `
title: Test
description: Test desc
tasks: []
`;
    expect(() => validatePRD(yaml)).toThrow("must contain at least one task");
  });

  it("should reject task with missing id", () => {
    const yaml = `
title: Test
description: Test desc
tasks:
  - title: Task
    description: Task desc
`;
    expect(() => validatePRD(yaml)).toThrow("id");
  });

  it("should reject task with missing title", () => {
    const yaml = `
title: Test
description: Test desc
tasks:
  - id: task-1
    description: Task desc
`;
    expect(() => validatePRD(yaml)).toThrow("title");
  });

  it("should reject task with missing description", () => {
    const yaml = `
title: Test
description: Test desc
tasks:
  - id: task-1
    title: Task
`;
    expect(() => validatePRD(yaml)).toThrow("description");
  });

  it("should reject invalid effort value", () => {
    const yaml = `
title: Test
description: Test desc
tasks:
  - id: task-1
    title: Task
    description: Task desc
    effort: invalid
`;
    expect(() => validatePRD(yaml)).toThrow("effort");
  });

  it("should reject invalid status value", () => {
    const yaml = `
title: Test
description: Test desc
tasks:
  - id: task-1
    title: Task
    description: Task desc
    result:
      status: invalid
      errors: []
`;
    expect(() => validatePRD(yaml)).toThrow("status");
  });
});
