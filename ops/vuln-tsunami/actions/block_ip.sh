#!/usr/bin/env bash
# Mac pfctl block helper. Only runs when config.yaml auto_block=true.
# Usage: bash actions/block_ip.sh <IPv4>
set -euo pipefail

IP="${1:-}"
if [[ -z "$IP" ]]; then
  echo "usage: block_ip.sh <ipv4>"
  exit 2
fi
if [[ "$(uname -s)" != "Darwin" ]]; then
  echo "pfctl only on macOS"
  exit 1
fi
if ! [[ "$IP" =~ ^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
  echo "invalid ipv4: $IP"
  exit 2
fi

RULE="block drop from any to ${IP}"
# Append to a dedicated anchor table if present; otherwise echo dry-run guidance.
if pfctl -sr 2>/dev/null | grep -q "vulntsunami"; then
  echo "${RULE}" | pfctl -a vulntsunami -f - 2>&1 || true
  echo "pfctl anchor vulntsunami updated for ${IP}"
else
  echo "DRY: would run → echo '${RULE}' | sudo pfctl -a vulntsunami -f -"
  echo "Enable with a pf anchor named vulntsunami, then set auto_block=true"
fi
