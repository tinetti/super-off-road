import yaml from "yaml";
import { z } from "zod";
import type { PRD } from "./prd.types.js";
import { PRDSchema } from "./prd.types.js";

/**
 * Parse a YAML string into a PRD object without validation.
 * @param yamlString - The YAML content to parse.
 * @returns The parsed PRD object (unvalidated).
 * @throws Error if YAML parsing fails.
 */
export function parsePRDUnsafe(yamlString: string): unknown {
  try {
    return yaml.parse(yamlString);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to parse YAML: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Parse and validate a YAML string into a typed PRD object.
 * @param yamlString - The YAML content to parse.
 * @returns The validated PRD object with default values applied.
 * @throws Error if parsing or validation fails.
 */
export function parsePRD(yamlString: string): PRD {
  const parsed = parsePRDUnsafe(yamlString);
  return validatePRD(yamlString);
}

/**
 * Validate a YAML string against the PRD schema.
 * @param yamlString - The YAML content to validate.
 * @returns The validated and typed PRD object.
 * @throws ZodError if validation fails with detailed error messages.
 */
export function validatePRD(yamlString: string): PRD {
  const parsed = parsePRDUnsafe(yamlString);

  const result = PRDSchema.safeParse(parsed);

  if (!result.success) {
    // Zod v4 uses 'issues' instead of 'errors'
    throw result.error;
  }

  return result.data;
}



/**
 * Validate that a PRD has at least one task.
 * Additional custom validation logic can be added here.
 */
export function ensureNonEmptyTasks(prd: PRD): void {
  if (prd.tasks.length === 0) {
    throw new Error("PRD must contain at least one task");
  }
}

/**
 * Validate that all task IDs are unique.
 */
export function validateUniqueTaskIds(prd: PRD): void {
  const ids = new Set<string>();

  for (const task of prd.tasks) {
    if (ids.has(task.id)) {
      throw new Error(`Duplicate task ID: ${task.id}`);
    }
    ids.add(task.id);
  }
}
