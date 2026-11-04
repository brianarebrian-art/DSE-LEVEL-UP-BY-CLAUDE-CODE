#!/usr/bin/env bash
# Install the Vulnerability Tsunami launchd agent on this MacBook Pro.
# Isolated from the website — writes only under ~/Library/LaunchAgents + local logs.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
LABEL="com.dselevelup.vuln-tsunami"
AGENTS_DIR="${HOME}/Library/LaunchAgents"
LOG_DIR="${HOME}/Library/Logs/dse-vuln-tsunami"
PLIST_SRC="${ROOT}/mac/${LABEL}.plist"
PLIST_DST="${AGENTS_DIR}/${LABEL}.plist"

if [[ "$(uname -s)" != "Darwin" ]]; then
  echo "Run this on the MacBook Pro (Darwin). Current OS: $(uname -s)"
  exit 1
fi

if [[ ! -f "${ROOT}/.env" && ! -f "${ROOT}/.env.local" ]]; then
  echo "Missing ${ROOT}/.env"
  echo "1. cp ${ROOT}/.env.example ${ROOT}/.env"
  echo "2. Paste NVD_API_KEY"
  echo "3. Re-run this script"
  exit 1
fi

NODE_BIN="$(command -v node || true)"
if [[ -z "${NODE_BIN}" ]]; then
  echo "node not found in PATH. Install Node 20+ then re-run."
  exit 1
fi

mkdir -p "${AGENTS_DIR}" "${LOG_DIR}"

sed \
  -e "s|__NODE_BIN__|${NODE_BIN}|g" \
  -e "s|__MONITOR_PATH__|${ROOT}/monitor.mjs|g" \
  -e "s|__WORKDIR__|${ROOT}|g" \
  -e "s|__LOG_DIR__|${LOG_DIR}|g" \
  "${PLIST_SRC}" > "${PLIST_DST}"

launchctl bootout "gui/$(id -u)/${LABEL}" 2>/dev/null || true
launchctl bootstrap "gui/$(id -u)" "${PLIST_DST}"
launchctl enable "gui/$(id -u)/${LABEL}"
launchctl kickstart -k "gui/$(id -u)/${LABEL}"

echo "Installed ${LABEL}"
echo "1. Polls NVD every 30 minutes"
echo "2. Notifies via macOS Notification Center on NEW stack hits"
echo "3. Logs: ${LOG_DIR}"
echo ""
echo "Next: run once now — node ${ROOT}/monitor.mjs --hours 24 --notify"
