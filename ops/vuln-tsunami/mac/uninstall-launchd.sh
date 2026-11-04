#!/usr/bin/env bash
# Remove the Vulnerability Tsunami launchd agent from this Mac.
set -euo pipefail

LABEL="com.dselevelup.vuln-tsunami"
PLIST_DST="${HOME}/Library/LaunchAgents/${LABEL}.plist"

if [[ "$(uname -s)" != "Darwin" ]]; then
  echo "Run on macOS. Current OS: $(uname -s)"
  exit 1
fi

launchctl bootout "gui/$(id -u)/${LABEL}" 2>/dev/null || true
rm -f "${PLIST_DST}"
echo "Removed ${LABEL}"
echo "Next: optional — rm -rf ~/Library/Logs/dse-vuln-tsunami"
