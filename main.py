"""
Super Off Road - iterative Ralph Loop skill driver

Core driver for reading PRD.yml, looping over tasks with lap analogy,
routing models per effort, executing tasks, tracking progress.

"""

import yaml
import sys
import os

PRD_FILE = "prd.yml"
MAX_ITERATIONS_PER_TASK = 10

# Status constants
STATUS_PENDING = "pending"
STATUS_IN_PROGRESS = "in-progress"
STATUS_PASSED = "passed"
STATUS_FAILED = "failed"


class SuperOffRoad:
    def __init__(self, prd_path=PRD_FILE):
        self.prd_path = prd_path
        self.prd_data = None

    def load_prd(self):
        with open(self.prd_path, "r") as f:
            self.prd_data = yaml.safe_load(f)

        # Initialize result fields if missing
        for task in self.prd_data.get("tasks", []):
            if "result" not in task:
                task["result"] = {"status": STATUS_PENDING, "errors": []}
            elif "status" not in task["result"]:
                task["result"]["status"] = STATUS_PENDING
            elif "errors" not in task["result"]:
                task["result"]["errors"] = []

    def save_prd(self):
        with open(self.prd_path, "w") as f:
            yaml.dump(self.prd_data, f)

    def select_next_task(self):
        for task in self.prd_data.get("tasks", []):
            status = task.get("result", {}).get("status", STATUS_PENDING)
            if status in [STATUS_PENDING, STATUS_FAILED]:
                return task
        return None

    def run(self):
        self.load_prd()

        # Iteration control
        lap_count = 0

        while True:
            task = self.select_next_task()
            if not task:
                print("All tasks passed! PRD complete.")
                break

            lap_count += 1
            if lap_count > MAX_ITERATIONS_PER_TASK:
                print(f"Reached max iterations {MAX_ITERATIONS_PER_TASK} without completing all tasks.")
                break

            print(f"Lap {lap_count}: Working on task: {task['id']} ({task['title']})")
            # Mark task in-progress
            task["result"]["status"] = STATUS_IN_PROGRESS
            self.save_prd()

            # TODO: Run model selection, task execution, feedback collection

            # For now, simulate a pass for demonstration
            task["result"]["status"] = STATUS_PASSED
            task["result"]["errors"] = []
            self.save_prd()


if __name__ == "__main__":
    prd_file = sys.argv[1] if len(sys.argv) > 1 else PRD_FILE
    sor = SuperOffRoad(prd_file)
    sor.run()

