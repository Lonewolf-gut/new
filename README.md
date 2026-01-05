````markdown
```markdown
# Monorepo (turborepo) for Lonewolf-gut/new

Structure
- apps/landing — marketing / landing site (Next.js)
- apps/web — main web app (Next.js)
- packages/ui — shared UI components (React + TypeScript)
- packages/utils — shared utilities (TypeScript)

Requirements
- Node 16+ (recommended) and npm 7+ (npm workspaces support)
- If you used pnpm earlier, remove pnpm artifacts: delete pnpm-lock.yaml and pnpm-workspace.yaml

Quick start (npm)
1. From repository root:
   - npm install
   - npm run dev

What the dev scripts do
- `npm run dev` (root) runs both apps in parallel through turbo: `turbo run dev --parallel`
- Each app's dev script runs `next dev` on its configured port. Landing uses 3000 by default, web uses 3001.

Notes
- Workspaces use the `workspace:` protocol; npm will link workspace packages automatically.
- If CI or deploy expects pnpm, update workflows to use `npm ci` / `npm install` instead.
- To fully remove pnpm traces, delete `pnpm-lock.yaml` and any `.npmrc` entries that force pnpm.

Examples of imports (unchanged)
- import { Hero } from '@new/ui'
- import { formatDate } from '@new/utils'
```
````
