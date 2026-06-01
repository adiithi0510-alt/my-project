# 📋 Task Manager CLI

A simple command-line task manager built with TypeScript. Add, complete, and delete tasks — all saved locally so they persist between sessions.

---



## 💻 Commands

| Command | Description | Example |
|---|---|---|
| `list` | Show all tasks | `list` |
| `add <title>` | Add a new task | `add Buy groceries` |
| `done <id>` | Mark a task as complete | `done 1` |
| `delete <id>` | Delete a task | `delete 2` |
| `help` | Show available commands | `help` |
| `exit` | Quit the app | `exit` |

---

## 📁 Project Structure

```
my-ts-project/
├── src/
│   └── index.ts       # Main source code
├── dist/              # Compiled JavaScript (auto-generated)
├── tasks.json         # Your saved tasks (auto-generated)
├── tsconfig.json      # TypeScript config
├── package.json       # Project config
└── README.md          # You are here
```

---

## 🛠️ Tech Stack

- **TypeScript** — typed JavaScript
- **Node.js** — runtime environment
- **fs / path / readline** — built-in Node modules, no extra dependencies

---

## 📝 Notes

- Tasks are saved in `tasks.json` in the project root — you can open it to see the raw data
- Run `npm run build` every time you make changes to `src/index.ts`
- The `dist/` folder is auto-generated, don't edit files inside it
