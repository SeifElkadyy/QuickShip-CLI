#!/bin/bash

echo "🧹 Cleaning up QuickShip CLI repository..."

# Remove development docs from git tracking (if they were committed)
echo "📝 Removing development docs from git..."
git rm --cached BUILD_STATUS.md GETTING_STARTED.md IMPLEMENTATION_ROADMAP.md PHASE_1_COMPLETE.md PROGRESS_TRACKER.md PROJECT_OVERVIEW.md QUICK_REFERENCE.md READY_TO_PUBLISH.md START_HERE.txt 2>/dev/null || echo "  → Files already removed or never tracked"

# Show what will be published
echo ""
echo "📦 Checking npm package contents..."
npm pack --dry-run

echo ""
echo "✅ Cleanup complete!"
echo ""
echo "Next steps:"
echo "  1. npm run format"
echo "  2. git add ."
echo "  3. git commit -m 'v0.10.22: Polish and cleanup'"
echo "  4. git tag v0.10.22"
echo "  5. git push origin main --tags"
echo "  6. npm publish --access public"
