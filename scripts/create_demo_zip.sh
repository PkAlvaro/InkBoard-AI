#!/usr/bin/env bash
set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUTPUT_NAME="inkboard-ai-demo.zip"
OUTPUT_PATH="${PROJECT_ROOT}/${OUTPUT_NAME}"

rm -f "${OUTPUT_PATH}"

pushd "${PROJECT_ROOT}" > /dev/null
zip -r "${OUTPUT_PATH}" . \
  -x "*.git*" \
     "node_modules/*" \
     "frontend/node_modules/*" \
     "__pycache__/*" \
     "*.pytest_cache/*" \
     "${OUTPUT_NAME}"
popd > /dev/null

echo "Created archive at ${OUTPUT_PATH}"
