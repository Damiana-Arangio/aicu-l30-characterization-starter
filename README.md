# Ticketing characterization starter

Student workspace for L30. The application preserves a slow legacy path and
provides observable API and dashboard-model boundaries to characterize before
future changes.

## Requirements

- Node.js 24, 25 or 26
- pnpm 11

## Start

```bash
pnpm install
pnpm dev
```

Open <http://localhost:3001>.

## Checks

```bash
pnpm verify
pnpm measure:dashboard
```

## Reset local data

```bash
pnpm reset
```

No API key, environment file or external service is required.

## Activity

Read [CONSEGNA.md](./CONSEGNA.md). Complete the TODO characterization tests,
prove that at least one of them turns red when its protected behavior is
temporarily broken, then restore the green baseline.
