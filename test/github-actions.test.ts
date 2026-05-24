import { describe, it, expect } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import yaml from "yaml";

describe("GitHub Actions Workflow", () => {
  const workflowPath = join(process.cwd(), ".github", "workflows", "ci.yml");

  it("should have .github/workflows/ci.yml file", () => {
    expect(existsSync(workflowPath)).toBe(true);
  });

  it("should have valid YAML syntax", () => {
    const content = readFileSync(workflowPath, "utf-8");
    expect(() => yaml.parse(content)).not.toThrow();
  });

  it("should have name field defined", () => {
    const content = readFileSync(workflowPath, "utf-8");
    const parsed = yaml.parse(content) as { name: string };
    expect(parsed.name).toBeDefined();
    expect(parsed.name).not.toBe("");
  });

  it("should have CI job that runs on PRs", () => {
    const content = readFileSync(workflowPath, "utf-8");
    const parsed = yaml.parse(content) as {
      on: { pull_request: unknown } | { push: unknown } | string;
      jobs: Record<string, unknown>;
    };

    expect(parsed.jobs).toBeDefined();
    expect(Object.keys(parsed.jobs).length).toBeGreaterThan(0);
  });

  it("should have build step", () => {
    const content = readFileSync(workflowPath, "utf-8");
    const parsed = yaml.parse(content) as {
      jobs: {
        [key: string]: {
          steps: Array<{ name?: string; run?: string }>;
        };
      };
    };

    const steps = Object.values(parsed.jobs).flatMap((job) => job.steps);
    const hasBuild = steps.some(
      (step) => step.name?.toLowerCase().includes("build") || step.run?.includes("npm run build")
    );

    expect(hasBuild).toBe(true);
  });

  it("should have test step", () => {
    const content = readFileSync(workflowPath, "utf-8");
    const parsed = yaml.parse(content) as {
      jobs: {
        [key: string]: {
          steps: Array<{ name?: string; run?: string }>;
        };
      };
    };

    const steps = Object.values(parsed.jobs).flatMap((job) => job.steps);
    const hasTest = steps.some(
      (step) => step.name?.toLowerCase().includes("test") || step.run?.includes("npm test")
    );

    expect(hasTest).toBe(true);
  });

  it("should run on Node.js", () => {
    const content = readFileSync(workflowPath, "utf-8");
    const parsed = yaml.parse(content) as {
      jobs: {
        [key: string]: {
          "runs-on": string;
        };
      };
    };

    const runsOn = Object.values(parsed.jobs).map((job) => job["runs-on"]);
    const hasNode = runsOn.some((runner) => runner.includes("ubuntu") || runner.includes("node"));

    expect(hasNode).toBe(true);
  });
});
