#!/usr/bin/env bash
# EDR isolate hook — CrowdStrike / SentinelOne.
# Usage: bash actions/edr_isolate.sh <hostId>
set -euo pipefail
HOST="${1:-unknown}"
echo "EDR: isolate requested for host=$HOST"
echo "EDR: wire CrowdStrike RTR / SentinelOne threat network isolate here"
exit 0
