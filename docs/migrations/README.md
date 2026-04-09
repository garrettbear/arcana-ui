# Migration Guides

This directory contains migration guides for releases with breaking changes. AI
agents and human developers should read the relevant guide when upgrading
between versions of Arcana UI.

## How to Find Your Migration Guide

1. Check `manifest.ai.json` for the `release.breaking` array on the version you
   are upgrading to. If the array is empty (`[]`), there are no breaking
   changes for that release.
2. If breaking changes exist, `release.migration` points to the guide URL and
   each entry in `release.breaking` lists the old form, the new form, and a
   one-line migration hint.
3. The `releaseHistory` array at the top of `manifest.ai.json` records the same
   data for every past release, so an agent upgrading across multiple versions
   can walk the array forward and apply every guide in order.
4. For complex changes that cannot be expressed as a find-and-replace, the
   migration URL leads to the full long-form guide in this directory.

## AI Agent Usage

An AI agent upgrading a project from version `A` to version `B` should:

1. Read `manifest.ai.json`.
2. Filter `releaseHistory` to every entry with a version `> A` and `≤ B`.
3. Concatenate every `breaking` entry from those releases.
4. For each `breaking` entry, apply the find-and-replace described by its
   `before`, `after`, and `migration` fields.
5. If an entry has a non-null `migration` URL, read the long-form guide before
   applying — those changes usually need more context than a simple
   substitution.
6. Run `pnpm build` (or `npm run build`) to verify the migration is complete
   and the type system is happy.

## Releases

| Version | Date       | Breaking Changes      | Migration Guide |
| ------- | ---------- | --------------------- | --------------- |
| 0.1.0   | 2026-04-09 | None (initial stable) | N/A             |

Future releases with breaking changes will be added to this table in
chronological order and each will link to a dedicated `{version}.md` file in
this directory, generated from the `TEMPLATE.md` scaffold.
