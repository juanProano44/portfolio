#!/usr/bin/env bash
set -euo pipefail

MAX_CRITICAL_BYTES=$((100 * 1024))

DIST_DIR="dist"
if [ ! -d "$DIST_DIR" ]; then
  echo "ERROR: dist/ directory not found. Run build first."
  exit 1
fi

TOTAL_GZIP=0

while IFS= read -r file; do
  SIZE=$(gzip -c "$file" | wc -c)
  TOTAL_GZIP=$((TOTAL_GZIP + SIZE))
  echo "  $file: $((SIZE / 1024))KB gzip"
done < <(find "$DIST_DIR" -type f \( -name "*.html" -o -name "*.css" -o -name "*.js" \) ! -path "*/lab*" ! -path "*/three*")

echo ""
echo "Critical path total: $((TOTAL_GZIP / 1024))KB gzip (budget: $((MAX_CRITICAL_BYTES / 1024))KB)"

if [ "$TOTAL_GZIP" -gt "$MAX_CRITICAL_BYTES" ]; then
  echo "FAIL: Bundle exceeds 100KB budget!"
  exit 1
fi

echo "PASS: Within budget."
