#!/usr/bin/env bash
# Patch schedule hook — brew upgrade / MDM.
# Usage: bash actions/patch_schedule.sh pkg1 pkg2 ...
set -euo pipefail
echo "PATCH: schedule $*"
if [[ "$(uname -s)" == "Darwin" ]] && command -v brew >/dev/null 2>&1; then
  echo "PATCH: brew available — founder may enable real upgrades in MDM pipeline"
fi
echo "PATCH: queued (no destructive upgrade executed by default)"
exit 0
