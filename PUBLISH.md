# Publishing QuickShip CLI v0.10.22

## Pre-Publish Cleanup Commands

Run these commands to clean up the repository before publishing:

### Step 1: Remove development docs from Git history (if previously committed)

```bash
# Remove from current commit
git rm --cached BUILD_STATUS.md GETTING_STARTED.md IMPLEMENTATION_ROADMAP.md PHASE_1_COMPLETE.md PROGRESS_TRACKER.md PROJECT_OVERVIEW.md QUICK_REFERENCE.md READY_TO_PUBLISH.md START_HERE.txt

# If these files exist in previous commits, remove from history (OPTIONAL - be careful!)
# Only do this if you haven't pushed yet or are okay rewriting history
git filter-branch --force --index-filter \
  'git rm --cached --ignore-unmatch BUILD_STATUS.md GETTING_STARTED.md IMPLEMENTATION_ROADMAP.md PHASE_1_COMPLETE.md PROGRESS_TRACKER.md PROJECT_OVERVIEW.md QUICK_REFERENCE.md READY_TO_PUBLISH.md START_HERE.txt' \
  --prune-empty --tag-name-filter cat -- --all
```

### Step 2: Verify what will be published

```bash
# Check what files will be included in npm package
npm pack --dry-run

# This should show ONLY:
# - bin/
# - src/
# - assets/
# - LICENSE
# - README.md
# - CHANGELOG.md
```

### Step 3: Format and lint code

```bash
# Format code
npm run format

# Check formatting
npm run format:check

# Lint code
npm run lint
```

### Step 4: Test locally

```bash
# Test the CLI locally
npm link

# Test creating a project
quickship build test-app

# Unlink when done testing
npm unlink
```

## Publishing to npm

### Step 5: Commit and tag

```bash
# Add all changes
git add .

# Commit
git commit -m "v0.10.22: Expo React Native with StyleSheet default and optional NativeWind"

# Create git tag
git tag v0.10.22

# Push to GitHub
git push origin main
git push origin v0.10.22
```

### Step 6: Publish to npm

```bash
# Login to npm (if not already logged in)
npm login

# Publish (with public access)
npm publish --access public

# Verify publication
npm view quickship-cli
```

## Post-Publish Verification

```bash
# Install from npm and test
npx quickship-cli@latest build test-final-app
```

## What Gets Published to npm:

✅ **Included in package:**
- bin/ (CLI executable)
- src/ (source code)
- assets/ (logo image)
- LICENSE
- README.md
- CHANGELOG.md

❌ **Excluded from package (kept locally):**
- node_modules/
- docs/
- BUILD_STATUS.md
- GETTING_STARTED.md
- IMPLEMENTATION_ROADMAP.md
- PHASE_1_COMPLETE.md
- PROGRESS_TRACKER.md
- PROJECT_OVERVIEW.md
- QUICK_REFERENCE.md
- READY_TO_PUBLISH.md
- START_HERE.txt
- .vscode/
- .idea/
- *.log files

## Quick Commands (All in One)

```bash
# Clean, format, commit, tag, and publish
npm run format && \
git add . && \
git commit -m "v0.10.22: Expo with StyleSheet default" && \
git tag v0.10.22 && \
git push origin main && \
git push origin v0.10.22 && \
npm publish --access public
```
