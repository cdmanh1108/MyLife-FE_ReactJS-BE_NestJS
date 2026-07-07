---
name: Clean Coding Guidelines
description: Applies design patterns, naming conventions, and clean coding guidelines for the project.
---

# Clean Coding Guidelines for MyLife OS

This skill ensures code formatting, naming consistency, and architecture match the standards of the MyLife OS codebase.

## 🛠️ General Standards
- **File Naming:**
  - Frontend Pages/Components: PascalCase (e.g. `BudgetsPage.tsx`, `PageHeader.tsx`).
  - Frontend Hooks/Utils: camelCase (e.g. `useTransactions.ts`, `date.ts`).
  - Backend Controllers/Modules/Services: kebab-case with dot suffix (e.g. `debts.controller.ts`, `debts.service.ts`, `debt-record.schema.ts`).
- **Imports:** Place third-party dependencies first, followed by internal absolute path aliases (`@/`), and lastly relative path imports.

## 🖥️ React & Frontend Clean Code
- **React Query Mutations:** Always invalidate the corresponding query keys inside `onSuccess` callbacks to keep the UI in sync (e.g. invalidate `QUERY_KEYS.DEBT_PEOPLE` after creating/deleting a person).
- **TypeScript Types:** Avoid the use of `any` types. Strongly type all response data, states, and props.
- **Tailwind Classes:** Keep styles unified by reusing tailwind tokens (`text-foreground`, `bg-card`, `text-muted-foreground`, etc.).

## ⚙️ NestJS & Mongoose Clean Code
- **DTO Definitions:** Use `class-validator` decorators (like `@IsString()`, `@IsOptional()`, `@IsEnum()`) properly. If a property should be excluded at creation, do not add it to the DTO or use validation constraints that allow it.
- **MongoDB Schema Properties:** Declare correct database index fields (e.g., indexes on `{ userId: 1, occurredAt: -1 }`) for fast querying performance.
