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