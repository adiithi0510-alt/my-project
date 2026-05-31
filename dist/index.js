"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const readline = __importStar(require("readline"));
const DATA_FILE = path.join(__dirname, "../tasks.json");
// ── File helpers ──────────────────────────────────────────────────────────────
function loadTasks() {
    if (!fs.existsSync(DATA_FILE))
        return [];
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(raw);
}
function saveTasks(tasks) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2));
}
// ── Commands ──────────────────────────────────────────────────────────────────
function listTasks() {
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
function addTask(title) {
    const tasks = loadTasks();
    const newTask = {
        id: tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 1,
        title,
        done: false,
        createdAt: new Date().toLocaleDateString(),
    };
    tasks.push(newTask);
    saveTasks(tasks);
    console.log(`✅ Added task [${newTask.id}]: "${title}"`);
}
function completeTask(id) {
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
function deleteTask(id) {
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
function showHelp() {
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
function parseAndRun(input) {
    const [command, ...rest] = input.trim().split(" ");
    const arg = rest.join(" ");
    switch (command.toLowerCase()) {
        case "list":
            listTasks();
            break;
        case "add":
            if (!arg)
                console.log("Usage: add <title>");
            else
                addTask(arg);
            break;
        case "done":
            if (!arg || isNaN(Number(arg)))
                console.log("Usage: done <id>");
            else
                completeTask(Number(arg));
            break;
        case "delete":
            if (!arg || isNaN(Number(arg)))
                console.log("Usage: delete <id>");
            else
                deleteTask(Number(arg));
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
function main() {
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
        }
        else {
            rl.prompt();
        }
    });
    rl.on("close", () => process.exit(0));
}
main();
