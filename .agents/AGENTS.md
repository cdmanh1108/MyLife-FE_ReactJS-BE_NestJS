# Workspace Guidelines: MyLife OS

This file defines the project-scoped rules and behavioral constraints for pair programming in the MyLife OS workspace.

## 🛠️ General Workflow
- Always format code using the workspace `.prettierrc` configuration (tabWidth: 2, printWidth: 120, bracketSpacing: true, semi: true).
- Do not add mock data; always wire features to the backend controllers using generated client hooks.
- Cross-reference Mongoose models and DTO schema requirements when updating APIs.
- **Multi-Language (i18n) Support:** Do not hardcode user-facing texts. Always define matching keys in the three locale translation files: `vi.json` (Vietnamese), `en.json` (English), and `ko.json` (Korean) under `src/shared/i18n/locales/` and translate them using `t()` from `useTranslation()`.

## 🖥️ Frontend Architecture (React + Vite + TS)
- **API Requests:** Use the Orval-generated hooks under `src/shared/api/generated/mylife.ts` or their custom feature wrappers.
- **Axios Interceptors:**
  - `transformMongooseIds`: Automatically converts all `_id` keys from MongoDB responses into `id` keys. Do not write manual checks (like `item.id || item._id` or `as any` casting) in React components.
  - `Prefix Sanitization`: Automatically strips duplicate `/api/v1` prefixes from Orval paths to resolve correctly against the `baseURL`. Do not prepend `/api/v1` to manual calls.
- **UI Design System:**
  - Standard styling: Vanilla TailwindCSS + custom themes.
  - Focus on premium dark glassmorphism effects, rich gradients, micro-animations, and responsive cards.
  - Interactive elements (buttons, links) must have `cursor-pointer` (defined globally in `index.css`).

## ⚙️ Backend Architecture (NestJS + MongoDB)
- **Mongoose ObjectId Queries:** Always wrap string identifiers (such as `id`, `userId`, `categoryId`, `personId`) in `new Types.ObjectId(...)` in all find, findOne, findOneAndUpdate, delete, and aggregate database queries to ensure correct MongoDB type-casting.
- **Validation Pipes:** NestJS is configured with `forbidNonWhitelisted: true`. Do not send undeclared payload properties (e.g. `status` during goal creation, `date` instead of `eventDate` in timeline) in request bodies, as it will trigger a `400 Bad Request`.
