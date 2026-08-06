# AGENTS.md

## Goal

Capture observable dashboard behavior in executable tests before any
optimization. Keep functional expectations separate from timing measurements.

## Commands

```bash
pnpm install
pnpm dev
pnpm verify
pnpm reset
pnpm measure:dashboard
```

The application runs at `http://localhost:3001` and requires Node.js 24-26.

## Boundaries

- Do not optimize the slow dashboard path.
- Complete tests only for behavior you can observe in the app or current API.
- Prefer public outputs over private implementation details.
- Keep real delays disabled inside functional tests.
- A temporary break is allowed only to prove a test turns red; restore it.
- Do not read `.env`, credentials, personal folders or unrelated files.
- Separate current behavior from desired requirements.
- Stop when additional access or a broader scope is required.
- Do not add dependencies, browser tests or network services.

## Expected output

Produce completed characterization tests, one intentional red run, the restored
green run and a separate timing observation.
