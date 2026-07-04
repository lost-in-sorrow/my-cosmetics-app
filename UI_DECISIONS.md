# UI Decisions

## Overall philosophy

The application is designed primarily for desktop use.

Priority:

1. Usability
2. Simplicity
3. Consistency
4. Visual appearance

Visual redesign should never reduce usability.

---

# Navigation

Main navigation:

- Категории
- Продукты
- Бренды

▼ Администрирование
- Бренды
- Категории
- OpenAPI

The "Variants" section has been removed from navigation.

Variants are managed only inside Product pages.

---

# Working pages vs Administration

Working pages are intended for everyday work.

They should contain only actions required during normal usage.

Administration pages contain:

- create
- edit
- delete
- configuration

Administrative actions should not appear on working pages.

---

# Brand Catalog

Purpose:

Browse and select brands.

Contains:

- search
- alphabetical navigation
- brand list

Does NOT contain:

- create
- edit
- delete
- ID display

These functions belong only to:

Администрирование → Бренды

---

# Brand sorting

Sorting order:

1. Symbols
2. Numbers
3. Latin alphabet
4. Cyrillic alphabet

This rule should be consistent across the application.

---

# Layout

Desktop-first.

Interfaces should:

- use available horizontal space;
- avoid excessive scrolling;
- remain compact;
- avoid oversized controls.

Lists should be compact and easy to scan.

---

# Future principles

Do not add interface elements "for future use".

If there is only one available action or sorting mode, do not display controls suggesting multiple choices.

Every visible control should provide actual value to the user.

# Brand Administration Editing

The brand administration page should not show a permanent edit form by default.

Rules:

- creation is available as a compact form;
- search is visible near creation controls;
- editing is initiated from a table row;
- edit UI appears only after selecting a brand;
- row actions use compact icon buttons with accessible labels;
- text action buttons should be avoided in dense admin tables.

# Admin Table Actions

Administrative table actions should use compact icon buttons.

Rules:

- edit action uses a pencil icon;
- delete action uses a trash icon;
- icon buttons must have title and aria-label;
- action buttons should be visually centered;
- text action buttons are avoided in dense tables.

# Shared UI Components

Reusable UI patterns should be extracted only after they stabilize on at least one real screen.

Current shared patterns:

- page header with count badge;
- compact search panel;
- admin table;
- icon action buttons;
- catalog name sorting.

The goal is consistency across brands and categories without large frontend rewrites.