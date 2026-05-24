#!/usr/bin/env node
import { parsePRD } from "./prd-parser.js";
import { readFileSync } from "node:fs";

const prdPath = process.argv[2] || "prd.yml";

try {
  const content = readFileSync(prdPath, "utf-8");
  const prd = parsePRD(content);

  console.log(`\n📋 PRD: ${prd.title}`);
  console.log(`${prd.description}\n`);
  console.log(`Created: ${prd.createdAt || "N/A"}`);
  console.log(`Tasks: ${prd.tasks.length}\n`);

  console.log("Tasks:");
  for (const task of prd.tasks) {
    const status = task.result.status;
    const effort = task.effort;
    console.log(`  [${status}] (${effort}) ${task.id}: ${task.title}`);
  }

  const pending = prd.tasks.filter((t: { result: { status: string } }) => t.result.status === "pending" || t.result.status === "failed");
  console.log(`\nPending/Failed: ${pending.length}`);

  const nextTask = pending[0];
  if (nextTask) {
    console.log(`\n🎯 Next task: ${nextTask.id}`);
  } else {
    console.log("\n✅ All tasks passed!");
  }
} catch (error) {
  if (error instanceof Error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
  throw error;
}
