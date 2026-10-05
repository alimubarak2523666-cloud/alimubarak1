#!/bin/bash
# mac-storage-cleanup.sh
# Frees space on macOS by clearing only disposable data: caches, logs, Trash,
# old installers, developer build junk, Homebrew leftovers, local Time Machine snapshots.
# It never touches Documents, Desktop, Photos, Mail messages, or apps.
#
# Usage:
#   bash mac-storage-cleanup.sh            -> DRY RUN. Lists what would be deleted. Deletes nothing.
#   bash mac-storage-cleanup.sh --apply    -> Actually deletes the items listed.
#   bash mac-storage-cleanup.sh --apply --backups
#                                          -> Also deletes iPhone/iPad backups stored on this Mac
#                                             (only do this if those devices back up to iCloud).
#   Add --downloads-days N to change the installer age cutoff (default 30 days).

set -u
APPLY=0; BACKUPS=0; DL_DAYS=30
while [ $# -gt 0 ]; do
  case "$1" in
    --apply) APPLY=1 ;;
    --backups) BACKUPS=1 ;;
    --downloads-days) shift; DL_DAYS="${1:-30}" ;;
    -h|--help) sed -n '2,16p' "$0"; exit 0 ;;
    *) echo "Unknown option: $1"; exit 1 ;;
  esac
  shift
done

if [ "$(uname)" != "Darwin" ]; then
  echo "This script is for macOS only."; exit 1
fi

MODE="DRY RUN (nothing will be deleted; add --apply to delete)"
[ $APPLY -eq 1 ] && MODE="APPLY (deleting)"
echo "Mode: $MODE"
echo

FREE_BEFORE=$(df -k / | awk 'NR==2{print $4}')
TOTAL_KB=0

size_kb() { du -sk "$1" 2>/dev/null | cut -f1; }
human() { awk -v k="$1" 'BEGIN{ if(k>1048576) printf "%.1f GB", k/1048576; else if(k>1024) printf "%.0f MB", k/1024; else printf "%d KB", k }'; }

# clear_dir <path> <label> : removes CONTENTS of a directory, keeps the directory.
clear_dir() {
  local p="$1" label="$2"
  [ -d "$p" ] || return 0
  local kb; kb=$(size_kb "$p"); kb=${kb:-0}
  [ "$kb" -lt 1024 ] && return 0
  printf '%-10s %s\n' "$(human "$kb")" "$label"
  TOTAL_KB=$((TOTAL_KB + kb))
  if [ $APPLY -eq 1 ]; then
    find "$p" -mindepth 1 -maxdepth 1 -exec rm -rf {} + 2>/dev/null
  fi
}

echo "---- Disposable data ----"
clear_dir "$HOME/.Trash"                                        "Trash"
clear_dir "$HOME/Library/Caches"                                "User caches (apps rebuild these)"
clear_dir "$HOME/Library/Logs"                                  "User logs"
clear_dir "$HOME/Library/Developer/Xcode/DerivedData"           "Xcode DerivedData (build output)"
clear_dir "$HOME/Library/Developer/Xcode/iOS DeviceSupport"     "Xcode iOS DeviceSupport"
clear_dir "$HOME/Library/Developer/CoreSimulator/Caches"        "iOS Simulator caches"
clear_dir "$HOME/Library/Containers/com.apple.mail/Data/Library/Mail Downloads" "Mail attachment downloads (originals stay in Mail)"
clear_dir "$HOME/.npm/_cacache"                                 "npm cache"
clear_dir "$HOME/.cache"                                        "~/.cache (pip, misc tools)"
clear_dir "$HOME/Library/Caches/pip"                            "pip cache"

echo
echo "---- Downloads: installers/archives older than $DL_DAYS days ----"
DL_KB=0
while IFS= read -r -d '' f; do
  kb=$(size_kb "$f"); DL_KB=$((DL_KB + ${kb:-0}))
  printf '%-10s %s\n' "$(human "${kb:-0}")" "$f"
  [ $APPLY -eq 1 ] && rm -f "$f"
done < <(find "$HOME/Downloads" -maxdepth 2 -type f \( -iname '*.dmg' -o -iname '*.pkg' -o -iname '*.zip' -o -iname '*.iso' \) -mtime +"$DL_DAYS" -print0 2>/dev/null)
[ $DL_KB -eq 0 ] && echo "(none)"
TOTAL_KB=$((TOTAL_KB + DL_KB))

echo
echo "---- Homebrew ----"
if command -v brew >/dev/null 2>&1; then
  if [ $APPLY -eq 1 ]; then brew cleanup -s --prune=all 2>&1 | tail -3; else brew cleanup -s --prune=all -n 2>/dev/null | tail -3; echo "(would run: brew cleanup -s --prune=all)"; fi
else
  echo "Not installed, skipping."
fi

echo
echo "---- Time Machine local snapshots ----"
SNAPS=$(tmutil listlocalsnapshots / 2>/dev/null | grep -c 'com.apple.TimeMachine' || true)
if [ "${SNAPS:-0}" -gt 0 ]; then
  echo "$SNAPS local snapshot(s) found. These often hold several GB."
  if [ $APPLY -eq 1 ]; then
    for d in $(tmutil listlocalsnapshots / | sed -n 's/.*TimeMachine\.\([0-9-]*\).*/\1/p'); do
      sudo tmutil deletelocalsnapshots "$d" >/dev/null 2>&1 && echo "  deleted snapshot $d"
    done
  else
    echo "(would delete them with: sudo tmutil deletelocalsnapshots <date>)"
  fi
else
  echo "None."
fi

echo
echo "---- iPhone / iPad backups ----"
B="$HOME/Library/Application Support/MobileSync/Backup"
if [ -d "$B" ] && [ -n "$(ls -A "$B" 2>/dev/null)" ]; then
  kb=$(size_kb "$B")
  echo "$(human "${kb:-0}") of device backups in $B"
  if [ $BACKUPS -eq 1 ]; then
    TOTAL_KB=$((TOTAL_KB + ${kb:-0}))
    [ $APPLY -eq 1 ] && rm -rf "$B"/* && echo "  deleted."
  else
    echo "  Kept. Re-run with --backups to delete (only if your devices also back up to iCloud)."
  fi
else
  echo "None."
fi

echo
echo "======================================"
if [ $APPLY -eq 1 ]; then
  FREE_AFTER=$(df -k / | awk 'NR==2{print $4}')
  echo "Freed approximately: $(human $((FREE_AFTER - FREE_BEFORE)))"
  echo "Free space now:      $(human "$FREE_AFTER")"
  echo "Restart your Mac to let macOS purge its own temporary files too."
else
  echo "Would free approximately: $(human "$TOTAL_KB")"
  echo "Run again with --apply to delete these items."
fi
