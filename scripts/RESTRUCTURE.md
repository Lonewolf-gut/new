# Restructure script

This repository contains a script to help move your existing single-app structure into the monorepo layout created earlier (apps/landing, apps/web, packages/ui, packages/utils).

Files added:
- `scripts/restructure-monorepo.sh` — executable script that performs the move and some basic codemods. It will create a new branch called `restructure/landing-web`.

How to run (recommended, locally):
1. Ensure you have a clean working tree (commit or stash any changes).
2. Make the script executable:
   ```bash
   chmod +x scripts/restructure-monorepo.sh
   ```
3. Run the script (dry run is not implemented; it will create a new branch):
   ```bash
   ./scripts/restructure-monorepo.sh
   ```
4. Review the new branch `restructure/landing-web` locally. If everything looks good push it:
   ```bash
   git push -u origin restructure/landing-web
   ```
5. If you want the script to also delete the original `src/` and `public/` directories after the move, re-run with:
   ```bash
   ./scripts/restructure-monorepo.sh --delete-originals
   ```

Notes & caveats:
- The script performs a best-effort move and some simple sed replacements, but it cannot safely update every import or edge case. Please review the generated branch for necessary manual fixes (import paths, relative module paths, tests, etc.).
- Large binary files (e.g. PNG) are moved using `git mv` when possible. If that fails the script copies them and adds to git.
- The script will not delete the original files unless `--delete-originals` is provided.
- After review you may want to run `npm install` in the repo root and `npm install` inside new app packages if needed, and run `npm run dev`.


Repository reference:
- If you want to view the current root src tree in the GitHub UI: https://github.com/Lonewolf-gut/new/tree/main/src
