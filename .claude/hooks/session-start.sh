#!/bin/bash
# SessionStart hook for Claude Code on the web:
#   - installs the browser-use CLI + skill (https://github.com/browser-use/browser-use)
#   - starts a headless Chromium with CDP on :9222 routed through the container proxy
#   - installs npm dependencies so `npm run lint` works
set -euo pipefail

if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

cd "${CLAUDE_PROJECT_DIR:-$(pwd)}"

# 1) browser-use CLI (idempotent; upgrades if already installed)
export PATH="$HOME/.local/bin:$PATH"
uv tool install --python 3.12 --upgrade browser-use >/dev/null 2>&1

# 2) Register the skill for Claude Code (skip the internal uv reinstall)
browser-use skill install --target claude --no-install >/dev/null

# 3) Headless Chromium for browser-use to attach to
CDP_PORT=9222
if ! curl -s --noproxy '*' "http://127.0.0.1:${CDP_PORT}/json/version" >/dev/null 2>&1; then
  CHROME_BIN="$(find /opt/pw-browsers -path '*chrome-linux/chrome' -type f 2>/dev/null | head -1)"
  if [ -n "$CHROME_BIN" ]; then
    PROXY_ARGS=()
    if [ -n "${HTTPS_PROXY:-}" ]; then
      PROXY_ARGS=(--proxy-server="$HTTPS_PROXY" --ignore-certificate-errors)
    fi
    setsid nohup "$CHROME_BIN" --headless=new --no-sandbox --disable-gpu \
      "${PROXY_ARGS[@]}" \
      --remote-debugging-port="$CDP_PORT" \
      --user-data-dir="$HOME/.cache/browser-use-chrome" \
      about:blank >/tmp/browser-use-chrome.log 2>&1 < /dev/null &
    for _ in $(seq 1 30); do
      curl -s --noproxy '*' "http://127.0.0.1:${CDP_PORT}/json/version" >/dev/null 2>&1 && break
      sleep 0.5
    done
  fi
fi

if [ -n "${CLAUDE_ENV_FILE:-}" ]; then
  echo "export BU_CDP_URL=http://127.0.0.1:${CDP_PORT}" >> "$CLAUDE_ENV_FILE"
  echo 'export PATH="$HOME/.local/bin:$PATH"' >> "$CLAUDE_ENV_FILE"
fi

# 4) Project dependencies (Next.js site) so lint/build work
npm install --no-audit --no-fund >/dev/null 2>&1
