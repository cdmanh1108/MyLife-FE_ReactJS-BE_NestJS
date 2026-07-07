---
name: English Git Commit Generator
description: Automatically formats and writes a Conventional Commits git commit message in English summarizing the completed task.
---

# English Git Commit Generator

This skill compels the agent to generate a clean, standard English Git commit message in Conventional Commits format at the end of every completed task.

## 📝 Commit Format Guidelines
Every time you complete a task, edit code, or resolve an issue, you must include a code block containing a ready-to-use Git commit message.

The message must follow the **Conventional Commits** specification:
- **Format:** `<type>(<scope>): <short description in present tense>`
- **Types:**
  - `feat`: A new feature (e.g. `feat(debts): add settlement optimization calculator`)
  - `fix`: A bug fix (e.g. `fix(backend): cast userId string to Mongoose ObjectId in queries`)
  - `docs`: Documentation changes
  - `style`: Changes that do not affect the meaning of the code (formatting, white-space, etc.)
  - `refactor`: A code change that neither fixes a bug nor adds a feature
  - `perf`: A code change that improves performance
  - `chore`: General maintenance tasks (e.g., updating dependencies, configurations)
- **Scope:** The area of the code being changed (e.g., `backend`, `frontend`, `auth`, `finance`, `debts`, `goals`).
- **Description:** Clear, concise English description, written in lowercase, present tense (e.g. "add custom filter" instead of "added custom filter").

## ⚡ Output Requirement
At the very end of your response summarizing your completed work, append a `Git Commit Message` section styled as follows:

### 📦 Proposed Git Commit
```bash
git commit -m "<type>(<scope>): <description>"
```
