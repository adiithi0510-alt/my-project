import * as fs from "fs";
import * as path from "path";
import * as readline from "readline";

interface Task {
  id: number;
  title: string;
  done: boolean;
  createdAt: string;
}

const DATA_FILE = path.join(__dirname, "../tasks.json");

// ── File helpers ──────────────────────────────────────────────────────────────

function loadTasks(): Task[] {
  if (!fs.existsSync(DATA_FILE)) return [];
  const raw = fs.readFileSync(DATA_FILE, "utf-8");
  return JSON.parse(raw) as Task[];
}

function saveTasks(tasks: Task[]): void {
  fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2));
}

// ── Commands ──────────────────────────────────────────────────────────────────

function listTasks(): void {
  const tasks = loadTasks();
  if (tasks.length === 0) {
    console.log("No tasks yet. Add one with: add <title>");
    return;
  }
  console.log("\n📋 Your Tasks:\n");
  tasks.forEach((t) => {
    const status = t.done ? "✅" : "⬜";
    console.log(`  ${status} [${t.id}] ${t.title}  (${t.createdAt})`);
  });
  console.log();
}

function addTask(title: string): void {
  const tasks = loadTasks();
  const newTask: Task = {
    id: tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 1,
    title,
    done: false,
    createdAt: new Date().toLocaleDateString(),
  };
  tasks.push(newTask);
  saveTasks(tasks);
  console.log(`✅ Added task [${newTask.id}]: "${title}"`);
}

function completeTask(id: number): void {
  const tasks = loadTasks();
  const task = tasks.find((t) => t.id === id);
  if (!task) {
    console.log(`❌ No task found with id ${id}`);
    return;
  }
  task.done = true;
  saveTasks(tasks);
  console.log(`✅ Marked task [${id}] as done: "${task.title}"`);
}

function deleteTask(id: number): void {
  const tasks = loadTasks();
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) {
    console.log(`❌ No task found with id ${id}`);
    return;
  }
  const [removed] = tasks.splice(index, 1);
  saveTasks(tasks);
  console.log(`🗑️  Deleted task [${id}]: "${removed.title}"`);
}

function showHelp(): void {
  console.log(`
📦 Task Manager CLI

Commands:
  list              Show all tasks
  add <title>       Add a new task
  done <id>         Mark a task as complete
  delete <id>       Delete a task
  help              Show this help message
  exit              Quit
`);
}

// ── REPL loop ─────────────────────────────────────────────────────────────────

function parseAndRun(input: string): boolean {
  const [command, ...rest] = input.trim().split(" ");
  const arg = rest.join(" ");

  switch (command.toLowerCase()) {
    case "list":
      listTasks();
      break;
    case "add":
      if (!arg) console.log("Usage: add <title>");
      else addTask(arg);
      break;
    case "done":
      if (!arg || isNaN(Number(arg))) console.log("Usage: done <id>");
      else completeTask(Number(arg));
      break;
    case "delete":
      if (!arg || isNaN(Number(arg))) console.log("Usage: delete <id>");
      else deleteTask(Number(arg));
      break;
    case "help":
      showHelp();
      break;
    case "exit":
      console.log("👋 Bye!");
      return false;
    default:
      console.log(`Unknown command: "${command}". Type help for usage.`);
  }
  return true;
}

function main(): void {
  console.log('🚀 Task Manager CLI — type "help" to get started');

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: "> ",
  });

  rl.prompt();

  rl.on("line", (line) => {
    const keepGoing = parseAndRun(line);
    if (!keepGoing) {
      rl.close();
    } else {
      rl.prompt();
    }
  });

  rl.on("close", () => process.exit(0));
}

main();