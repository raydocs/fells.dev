# Dependency security patch verification — 2026-10-28

Source baseline: `origin/hydra` at `11de4d8fc1017b03f33c29cf911cc9ad10cbfedf`. This change updates only four transitive versions in `pnpm-lock.yaml`; the root dependency ranges and existing `http-cache-semantics` patch remain unchanged:

| Package | Before | After |
| --- | --- | --- |
| vite | 8.3.2 | 8.3.3 |
| zod | 4.6.5 | 4.6.6 |
| undici | 8.11.2 | 8.12.2 |
| fast-uri | 3.1.8 | 3.1.9 |

The lockfile was generated with temporary version-specific pnpm overrides; the overrides and their modified peer-range entry were then removed. All four selected versions satisfy the existing dependency ranges. A fresh `pnpm install --frozen-lockfile` succeeded with no overrides. No application source was changed.

On macOS arm64 with Node 24.22.1 and pnpm 11.19.0, `pnpm audit --audit-level=high` reported no known vulnerabilities for the revised lockfile (the original audit reported 6 high, 10 moderate and 3 low). This result is time-dependent and is not a guarantee against unknown vulnerabilities.

The 13 unit-test files other than `account-api.test.mjs` passed: 141 tests, no failures. `pnpm test` as a whole reported 152 passes and four failures, all in `account-api.test.mjs`: financial adapter DTOs, support-only checkout links, mixed-protocol token totals, and Token Plan price confirmation. Running the original lockfile at the same source commit in a separate worktree produced the same four failed test names and the same 152/4 totals. This comparison does not establish the correctness of those failing behaviors.

`pnpm build` failed before building, with 27 existing Astro/TypeScript diagnostics involving missing modules, missing app-service exports and type mismatches. It is therefore not evidence of a working build, and browser/integration or full coverage tests were not run. Restore the complete trusted customer-site source, resolve its baseline test failures, and run frozen install, audit, build, complete unit and browser/integration regressions on the proposed final tree before merging or releasing. All checks here used local files and test fixtures; no live environment or customer data was accessed.
