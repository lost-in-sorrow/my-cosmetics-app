# AGENTS.md

## Project

This project is a desktop web application for managing a product catalog.

Primary target platform:
- Desktop
- Full HD (1920×1080) and above

Do not design pages as mobile-first interfaces.

---

## General rules

- Make small, isolated iterations.
- Do not perform large refactorings unless explicitly requested.
- Do not modify backend code unless the task explicitly requires it.
- Do not change API contracts.
- Do not add new dependencies unless necessary.
- After every iteration ensure the project builds successfully.
- Remove dead code and unused imports before finishing.

---

## Frontend principles

- Desktop-first.
- Use available screen width efficiently.
- Avoid large empty areas.
- Prefer compact layouts.
- Keep spacing consistent.
- Minimize visual noise.

Do not create oversized:
- buttons;
- inputs;
- cards;
- headers;
- vertical spacing.

---

## UX principles

One screen = one primary task.

Separate working pages from administration pages.

Working pages should focus on:
- browsing;
- searching;
- selecting.

Administrative pages should contain:
- create;
- edit;
- delete;
- configuration.

Do not mix these scenarios.

---

## Navigation

Current navigation:

- Категории
- Продукты
- Бренды
- Администрирование
    - Бренды
    - Категории
    - OpenAPI

"Варианты" are not a standalone section.
Variants exist only inside Product pages.

---

## Sorting

Use the same ordering everywhere:

1. Symbols
2. Numbers
3. Latin alphabet
4. Cyrillic alphabet

---

## Before finishing

Always:

- verify the build;
- preserve existing functionality;
- list changed files;
- briefly summarize completed work.