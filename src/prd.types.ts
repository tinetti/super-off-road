import { z } from "zod";

// Status enum for task results
export const StatusSchema = z.enum([
  "pending",
  "in-progress",
  "passed",
  "failed",
]);

export type Status = z.infer<typeof StatusSchema>;

// Effort level for routing model selection
export const EffortLabelSchema = z.enum(["low", "medium", "high", "expert"]);

export type EffortLabel = z.infer<typeof EffortLabelSchema>;

// Error details for task results
export const ErrorDetailSchema = z.object({
  code: z.string(),
  message: z.string(),
  path: z.string().optional(),
});

export type ErrorDetail = z.infer<typeof ErrorDetailSchema>;

// Task result tracking
export const TaskResultSchema = z.object({
  status: StatusSchema,
  errors: z.array(ErrorDetailSchema).default([]),
  message: z.string().optional(),
  completedAt: z.string().optional(), // ISO 8601 date
});

export type TaskResult = z.infer<typeof TaskResultSchema>;

// Individual task definition
export const TaskSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  effort: EffortLabelSchema.default("medium"),
  acceptanceCriteria: z.array(z.string()).default([]),
  result: TaskResultSchema.default({ status: "pending", errors: [] }),
  createdAt: z.string().optional(), // ISO 8601 date
  updatedAt: z.string().optional(), // ISO 8601 date
});

export type Task = z.infer<typeof TaskSchema>;

// Top-level PRD schema
export const PRDSchema = z.object({
  title: z.string(),
  description: z.string(),
  tasks: z.array(TaskSchema).min(1, "PRD must contain at least one task"),
  createdAt: z.string().optional(), // ISO 8601 date
  updatedAt: z.string().optional(), // ISO 8601 date
  version: z.string().optional(),
});

export type PRD = z.infer<typeof PRDSchema>;
