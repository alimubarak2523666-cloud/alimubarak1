#!/usr/bin/env bash
# setup_reel.sh — one-time setup of the claude-reel engine for the gulf-reel-analyst skill.
#
# Run it in Terminal on your own Mac (or Linux):
#     bash setup_reel.sh            # install / repair everything
#     bash setup_reel.sh --check    # only report what is installed, change nothing
#     bash setup_reel.sh --test URL # after setup, analyse one public reel as a test
#
# What it does:
#   1. Python 3.10+ and ffmpeg (via Homebrew on macOS)
#   2. Downloads claude-reel (MIT, github.com/Murtadha-Najem/claude-reel) to ~/.claude/skills/reel
#   3. Creates a private Python environment there and installs its libraries (~1.5 GB with torch)
#   4. Downloads the audio model that tells speech from music (~330 MB)
#   5. Asks for your Gemini API key (typed hidden, saved only on this computer)
#   6. Installs your Instagram cookies file (exported from your browser)
# Secrets never leave this computer and are never shown on screen.

set -euo pipefail

REEL_DIR="$HOME/.claude/skills/reel"
CONF="$HOME/.config/reel"
KEYFILE="$CONF/gemini_keys.txt"
COOKIES="$CONF/cookies.txt"
VENV="$REEL_DIR/.venv"
MODE="${1:-install}"

ok()   { printf '  \033[32m✓\033[0m %s\n' "$1"; }
bad()  { printf '  \033[31m✗\033[0m %s\n' "$1"; }
info() { printf '\n\033[1m%s\033[0m\n' "$1"; }

find_python() {
  for p in python3.13 python3.12 python3.11 python3.10 python3; do
    if command -v "$p" >/dev/null 2>&1 && "$p" -c 'import sys; sys.exit(0 if sys.version_info >= (3,10) else 1)' 2>/dev/null; then
      command -v "$p"; return 0
    fi
  done
  return 1
}

check_gemini_key() {  # $1 = key; returns 0 if Google accepts it
  local code
  code=$(curl -s -o /dev/null -w '%{http_code}' -H "x-goog-api-key: $1" \
    "https://generativelanguage.googleapis.com/v1beta/models?pageSize=1" || true)
  [ "$code" = "200" ]
}

status() {
  info "Status"
  PY=$(find_python || true)
  [ -n "${PY:-}" ] && ok "Python: $($PY --version 2>&1)" || bad "Python 3.10+ not found"
  command -v ffmpeg >/dev/null && ok "ffmpeg installed" || bad "ffmpeg not installed"
  [ -f "$REEL_DIR/reel.py" ] && ok "claude-reel at $REEL_DIR" || bad "claude-reel not downloaded"
  [ -x "$VENV/bin/python" ] && "$VENV/bin/python" -c 'import cv2, rapidocr, yt_dlp, google.genai' 2>/dev/null \
    && ok "Python libraries installed" || bad "Python libraries missing"
  [ -d "$HOME/panns_data" ] && ok "audio model downloaded" || bad "audio model not downloaded (optional)"
  if [ -s "$KEYFILE" ]; then
    if check_gemini_key "$(head -n1 "$KEYFILE")"; then ok "Gemini key saved and accepted by Google"; else bad "Gemini key saved but Google rejected it (or no internet)"; fi
  else bad "no Gemini key"; fi
  if [ -s "$COOKIES" ] && grep -q "sessionid" "$COOKIES"; then ok "Instagram cookies installed"
  else bad "no Instagram cookies"; fi
}

if [ "$MODE" = "--check" ]; then status; exit 0; fi

if [ "$MODE" = "--test" ]; then
  URL="${2:?give a public reel link, e.g. bash setup_reel.sh --test https://www.instagram.com/reel/XXXX/}"
  "$VENV/bin/python" "$REEL_DIR/reel.py" "$URL"
  exit $?
fi

# ------------------------------------------------------------------ 1. Python + ffmpeg
info "1/6  Python and ffmpeg"
OS="$(uname -s)"
if [ "$OS" = "Darwin" ]; then
  if ! command -v brew >/dev/null 2>&1; then
    echo "  Homebrew is needed. Install it from https://brew.sh (one command), then run this script again."
    exit 1
  fi
  find_python >/dev/null || brew install python@3.12
  command -v ffmpeg >/dev/null || brew install ffmpeg
else
  if ! find_python >/dev/null || ! command -v ffmpeg >/dev/null; then
    echo "  Install Python 3.10+ (with venv) and ffmpeg with your package manager, e.g.:"
    echo "    sudo apt install python3 python3-venv ffmpeg"
    exit 1
  fi
fi
PY=$(find_python); ok "$($PY --version)"; ok "ffmpeg $(ffmpeg -version | head -n1 | awk '{print $3}')"

# ------------------------------------------------------------------ 2. claude-reel
info "2/6  claude-reel engine"
if [ -d "$REEL_DIR/.git" ]; then
  git -C "$REEL_DIR" pull --ff-only -q && ok "updated $REEL_DIR"
else
  mkdir -p "$(dirname "$REEL_DIR")"
  git clone -q https://github.com/Murtadha-Najem/claude-reel "$REEL_DIR" && ok "downloaded to $REEL_DIR"
fi

# ------------------------------------------------------------------ 3. libraries
info "3/6  Python libraries (first time: several minutes, ~1.5 GB)"
[ -x "$VENV/bin/python" ] || "$PY" -m venv "$VENV"
"$VENV/bin/python" -m pip install -q --upgrade pip
"$VENV/bin/python" -m pip install -q -r "$REEL_DIR/requirements.txt"
ok "libraries installed in $VENV"

# ------------------------------------------------------------------ 4. audio model
info "4/6  Audio model (~330 MB, optional but recommended)"
if [ -d "$HOME/panns_data" ]; then ok "already downloaded"
else
  read -r -p "  Download it now? [Y/n] " a
  if [[ ! "$a" =~ ^[Nn] ]]; then (cd "$REEL_DIR" && "$VENV/bin/python" setup_models.py) && ok "downloaded"; else echo "  skipped — speech/music detection will lean on Gemini more"; fi
fi

# ------------------------------------------------------------------ 5. Gemini key
info "5/6  Gemini API key (for transcribing speech)"
mkdir -p "$CONF"; chmod 700 "$CONF"
if [ -s "$KEYFILE" ] && check_gemini_key "$(head -n1 "$KEYFILE")"; then
  ok "a working key is already saved"
else
  echo "  Get a free key: open https://aistudio.google.com/apikey , sign in with Google,"
  echo "  click 'Create API key', and copy it. Then paste it here (it stays hidden)."
  while true; do
    read -r -s -p "  Gemini API key: " KEY; echo
    [ -z "$KEY" ] && { echo "  skipped — reels will be analysed without speech transcripts"; break; }
    if check_gemini_key "$KEY"; then
      umask 077; printf '%s\n' "$KEY" > "$KEYFILE"; chmod 600 "$KEYFILE"
      ok "key accepted by Google and saved to $KEYFILE (only you can read it)"; break
    else
      bad "Google did not accept that key (typo, or no internet). Try again, or press Enter to skip."
    fi
  done
  unset KEY
fi

# ------------------------------------------------------------------ 6. Instagram cookies
info "6/6  Instagram cookies (lets the engine download reels)"
if [ -s "$COOKIES" ] && grep -q "sessionid" "$COOKIES"; then
  ok "cookies already installed"
else
  cat <<'TXT'
  Instagram blocks anonymous downloads, so the engine uses your login cookies.
  Use a SECONDARY Instagram account if you can — the file is equivalent to being logged in.
    a. In Chrome, install the extension "Get cookies.txt LOCALLY".
    b. Log in to instagram.com with that account.
    c. Click the extension → "Export" (Netscape format). A file like
       instagram.com_cookies.txt lands in your Downloads folder.
TXT
  DEFAULT=$(ls -t "$HOME"/Downloads/*instagram*cookies*.txt "$HOME"/Downloads/cookies*.txt 2>/dev/null | head -n1 || true)
  read -r -p "  Path to the exported file [${DEFAULT:-none found — export first}]: " P
  P="${P:-$DEFAULT}"; P="${P/#\~/$HOME}"
  if [ -n "$P" ] && [ -f "$P" ] && grep -q "sessionid" "$P"; then
    umask 077; mv "$P" "$COOKIES"; chmod 600 "$COOKIES"
    ok "cookies installed to $COOKIES (moved out of Downloads)"
  else
    bad "no valid cookies file (it must contain an Instagram 'sessionid'). Run this script again after exporting."
  fi
fi

status
echo
echo "Done. Test with:  bash $(basename "$0") --test https://www.instagram.com/reel/<any public reel>/"
echo "Then in Claude Code just paste a reel link and ask «حلل هالريل»."
echo "Cookies expire every few weeks — if Instagram refuses them, export again and rerun this script."
