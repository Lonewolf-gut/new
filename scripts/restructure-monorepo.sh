#!/usr/bin/env bash
set -euo pipefail

BRANCH="restructure/landing-web"
DELETE_ORIGINALS=false

if [ "${1:-}" = "--delete-originals" ]; then
  DELETE_ORIGINALS=true
fi

# create a new branch for the restructure
git fetch origin main
git checkout -b "$BRANCH"

echo "Creating apps and packages directories..."
mkdir -p apps/landing/src/components apps/landing/src/pages apps/landing/public
mkdir -p apps/web/src
mkdir -p packages/ui/src/components packages/utils/src

# Move landing-specific component directory
if [ -d src/components/landing-page ]; then
  echo "Moving landing-page components to apps/landing/src/components/landing-page"
  git mv src/components/landing-page apps/landing/src/components/ || (cp -R src/components/landing-page apps/landing/src/components/ && git add apps/landing/src/components/landing-page)
fi

# Move Footer if present (used by landing)
if [ -f src/components/Footer.tsx ]; then
  echo "Moving Footer to apps/landing/src/components/"
  mkdir -p apps/landing/src/components
  git mv src/components/Footer.tsx apps/landing/src/components/ || (cp src/components/Footer.tsx apps/landing/src/components/ && git add apps/landing/src/components/Footer.tsx)
fi

# Move landing pages: LandingPage, Terms, Privacy, Payment
for f in LandingPage Terms Privacy Payment; do
  if [ -f "src/pages/${f}.tsx" ]; then
    echo "Moving src/pages/${f}.tsx -> apps/landing/src/pages/${f}.tsx"
    mkdir -p apps/landing/src/pages
    git mv "src/pages/${f}.tsx" "apps/landing/src/pages/${f}.tsx" || (cp "src/pages/${f}.tsx" "apps/landing/src/pages/${f}.tsx" && git add "apps/landing/src/pages/${f}.tsx")
  fi
done

# Move shared UI building blocks to packages/ui
if [ -d src/components/ui ]; then
  echo "Moving shared UI components to packages/ui/src/components"
  git mv src/components/ui packages/ui/src/components/ || (cp -R src/components/ui packages/ui/src/components/ && git add packages/ui/src/components)
fi

# Move utils into packages/utils
if [ -d src/utils ]; then
  echo "Moving src/utils -> packages/utils/src"
  git mv src/utils packages/utils/src/ || (cp -R src/utils packages/utils/src/ && git add packages/utils/src)
fi

# Move lib utils into packages/utils if present
if [ -f src/lib/utils.ts ]; then
  echo "Moving src/lib/utils.ts -> packages/utils/src/utils.ts"
  mkdir -p packages/utils/src
  git mv src/lib/utils.ts packages/utils/src/utils.ts || (cp src/lib/utils.ts packages/utils/src/utils.ts && git add packages/utils/src/utils.ts)
fi

# Move remaining app code into apps/web/src (preserve landing items already moved)
if [ -d src ] && [ "$(ls -A src 2>/dev/null)" ]; then
  for item in src/*; do
    case "$item" in
      src/components|src/components/*|src/components/landing-page|src/components/ui)
        continue
        ;;
      src/pages/LandingPage.tsx|src/pages/Terms.tsx|src/pages/Privacy.tsx|src/pages/Payment.tsx)
        continue
        ;;
    esac

    echo "Moving $item -> apps/web/src/"
    git mv "$item" "apps/web/src/" 2>/dev/null || (
      mkdir -p "apps/web/src/" &&
      cp -R "$item" "apps/web/src/" &&
      git add "apps/web/src/$(basename "$item")"
    )
  done
else
  echo "src/ directory is empty or already moved — skipping app source move."
fi


# Move selected lib files (api, toast) into apps/web/src/lib if present
if [ -d src/lib ]; then
  mkdir -p apps/web/src/lib
  for f in src/lib/*; do
    base=$(basename "$f")
    if [[ "$base" == "api.ts" || "$base" == "toast.ts" ]]; then
      echo "Moving $f -> apps/web/src/lib/$base"
      git mv "$f" "apps/web/src/lib/" || (cp "$f" "apps/web/src/lib/" && git add "apps/web/src/lib/$base")
    fi
  done
fi

# Move public assets used by landing into apps/landing/public
for asset in logo.svg logo-white.svg welcome-illus.svg hero-img.png; do
  if [ -f "public/$asset" ]; then
    echo "Moving public/$asset -> apps/landing/public/$asset"
    mkdir -p apps/landing/public
    git mv "public/$asset" "apps/landing/public/$asset" || (cp "public/$asset" "apps/landing/public/$asset" && git add "apps/landing/public/$asset")
  fi
done

# Basic code adjustments (non-exhaustive): remove LandingPage import from app router and replace root route with a redirect to /app
if [ -f "apps/web/src/routes/AppRouter.tsx" ]; then
  echo "Patching apps/web/src/routes/AppRouter.tsx to remove LandingPage import and redirect root"
  sed -i.bak "/import .*LandingPage.*$/d" apps/web/src/routes/AppRouter.tsx || true
  sed -i.bak "s|<LandingPage />|<Navigate to=\"/app\" />|g" apps/web/src/routes/AppRouter.tsx || true
  rm -f apps/web/src/routes/AppRouter.tsx.bak || true
fi

# Stage everything and create commit
git add -A
git commit -m "Restructure: move landing components to apps/landing, app code to apps/web, extract packages/ui and packages/utils (scripted move)" || echo "No changes to commit"

echo "Restructure branch created: $BRANCH"
echo "Review changes locally, then push with: git push -u origin $BRANCH"

echo "To remove original root src/ and public/ after review, re-run this script with --delete-originals"
