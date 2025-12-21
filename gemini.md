# Gemini Code Assist Project Context

This document defines the architectural and coding conventions for this monorepo. All code generation and analysis by Gemini Code Assist must strictly adhere to these rules.

## I. General Monorepo & Tooling Constraints

1.  **Package Manager:** This project uses **pnpm** workspaces. All dependency management commands must use pnpm (e.g., pnpm add, pnpm install, pnpm add --filter <package>). Never use npm or yarn.
2.  **Language:** All code is TypeScript. Ensure strong typing and use strict mode conventions.
3.  **Internal Dependencies:** All packages reside in the `apps/` and `packages/` directories. Reference internal packages using the `@my-org/package-name` alias.
4.  **Testing Framework:** **Jest** is the required testing framework for all packages. Tests must be generated in the module system native to the package being tested (see sections II & III).
5.  **Path Aliases:** Assume that path aliases (e.g., `@app/`, `@test/`) are configured in `tsconfig.json`. Use these aliases instead of long relative paths (e.g., avoid `../../../`).
6.  **Test Verification:** Before suggesting a solution, ALWAYS run relevant tests to ensure they pass. If tests fail, debug and fix them before presenting the final solution.

## II. Coding Standards & SOLID Rules
 
 1.  **S - Single Responsibility Principle:** ensure that every class, module, or function has one, and only one, reason to change.
 2.  **O - Open/Closed Principle:** Software entities should be open for extension but closed for modification. Use decorators, inheritance, or composition to extend behavior without altering core code.
 3.  **L - Liskov Substitution Principle:** Subtypes must be substitutable for their base types without altering the correctness of the program. 
 4.  **I - Interface Segregation:** Clients should not be forced to depend upon interfaces that they do not use. Prefer small, focused interfaces over large "God" interfaces.
 5.  **D - Dependency Inversion:** Depend upon abstractions, not concrete details. Inject dependencies (especially in NestJS) using interfaces.
 
 ## III. Architecture & Patterns
 
 1.  **Shared Logger:** Do not use `console.log`. All applications must use the shared `@repo/logger` package.
 2.  **Strict Typing:**
     *   **No `any`:** The usage of `any` is strictly prohibited, **unless strictly required by an external interface (e.g., NestJS `LoggerService`)**.
     *   **DTOs:** Use Data Transfer Objects (DTOs) for all API request/response payloads.
     *   **Explicit Returns:** Public methods must have explicit return types.
 3.  **Configuration:** Never hardcode secrets or URLs. Use environment variables via `ConfigService` (NestJS) or `process.env`.
 4.  **Error Handling:** Throw specific implementations of `Error` or `HttpException`. Never throw raw strings or generic objects.
 
 ## IV. NestJS Backend (`apps/scraper-api` - CommonJS)

The primary backend application uses NestJS.

1.  **Module System:** This package **must use CommonJS (CJS)** for its runtime environment.
2.  **Import/Export:** When generating code or tests for this package, use the standard TypeScript `import { ... } from '...';` syntax for external libraries and internal packages; the TS compiler handles the conversion to CJS. Do not manually use `require()`.
3.  **Controllers/Services:** Follow standard NestJS conventions. Use custom logger `AppLogger` instead of the default NestJS Logger class.
4.  **Testing Convention:** All unit and integration tests must be written using NestJS's `TestingModule` and follow the convention of creating dedicated mock classes for dependencies.

## V. Puppeteer Utility (`apps/scraper-engine` - ESM)

The Puppeteer utility packages are modern, browser-automation utilities.

1.  **Module System:** This package **must use ECMAScript Modules (ESM)**. The `package.json` file for this package has `"type": "module"`.
2.  **Import Syntax:** All imports must use the `import ... from '...'` syntax. If importing local files within this package, ensure that the final compiled JavaScript file will require the **full file extension** in the import path (e.g., `./utils.js`), even if the source file is `./utils.ts`. Gemini should be mindful of this when generating imports.
3.  **Puppeteer Usage:** All Puppeteer commands should favor modern `await page.goto()` and `page.waitForSelector()` patterns.
4.  **Testing:** Tests for this package must be compatible with the ESM environment (e.g., no default CJS global access).

## VI. Data Layer (Prisma)

1.  **ORM:** Use **Prisma** for all database interactions.
2.  **Database:** The project is configured for **SQLite** (`dev.db`). Do not introduce other database requirements without explicit approval.
3.  **Schema Management:**
    -   Modifications to the database structure must be done via `prisma/schema.prisma`.
    -   Run `pnpm exec prisma migrate dev` to apply changes and generate the client.
4.  **Usage:** Inject `PrismaService` into modules/services. Do not instantiate `PrismaClient` manually.

## VII. ESLint Compliance & Code Quality

1.  **Strict Adherence:** All code must strictly adhere to the ESLint rules defined in the project.
2.  **Unused Variables:** Prefix any unused variables (including catch block errors and function arguments) with an underscore `_`.
    -   *Incorrect:* `catch (e) {}`
    -   *Correct:* `catch (_e) {}`
3.  **Floating Promises:** All Promises must be handled appropriately, especially in the `scraper-engine`.
    -   Use `await` where async operations are performed.
    -   Use `void` operator if the promise is intentionally not awaited (e.g., `void main();`).
    -   *Incorrect:* `page.goto(url);`
    -   *Correct:* `await page.goto(url);`
4.  **No Explicit Any:** Avoid `any` whenever possible. If unavoidable, use `// eslint-disable-next-line @typescript-eslint/no-explicit-any` with a comment explaining why.
5.  **React Hooks:** Follow rules of hooks. Do not call hooks conditionally or inside loops.
6.  **Accessibility (a11y):** Ensure JSX elements have appropriate accessibility attributes (e.g., `alt` for images).

## VIII. Refactoring/Code Review

When reviewing or refactoring code:

- Prioritize code that enforces the module system (CJS vs. ESM) appropriate for the package.
- Check that pnpm-specific commands are used in any generated workflow or documentation.
