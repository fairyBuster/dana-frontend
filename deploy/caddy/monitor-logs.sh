#!/bin/bash

# Pastikan 'jq' terinstall untuk parsing JSON
if ! command -v jq &> /dev/null; then
    echo "Error: 'jq' belum terinstall. Silakan install dengan: sudo apt install jq"
    exit 1
fi

LOG_FILE="/var/log/caddy/access.log"

echo "==================================================================================="
echo " MONITORING REQUEST CADDY PROXY (REALTIME)"
echo " Log File: $LOG_FILE"
echo "==================================================================================="
echo "Time | IP | Method | Host | URI | Status | Latency | User-Agent"
echo "-----------------------------------------------------------------------------------"

# Tampilkan log secara realtime
tail -f "$LOG_FILE" | jq -r -c '
  try (
    .ts as $ts |
    .request.remote_ip as $ip |
    .request.method as $method |
    .request.host as $host |
    .request.uri as $uri |
    .status as $status |
    .duration as $duration |
    .request.headers["User-Agent"][0] as $ua |
    
    # Format Output
    "\($ts | todate) | \($ip) | \($method) | \($host) | \($uri) | \($status) | \($duration)s | \($ua[0:50])..."
  ) catch empty
'
