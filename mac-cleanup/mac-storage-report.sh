#!/bin/bash
# mac-storage-report.sh
# READ-ONLY storage test for macOS. Deletes nothing. Safe to run any time.
# Usage:  bash mac-storage-report.sh
# Output is also saved to ~/Desktop/storage-report.txt

set -u
REPORT="$HOME/Desktop/storage-report.txt"
exec > >(tee "$REPORT") 2>&1

hr() { printf '\n==== %s ====\n' "$1"; }
size_of() { du -sh "$1" 2>/dev/null | cut -f1; }

hr "DISK OVERVIEW"
df -h / | awk 'NR==1 || /\/$/'
echo
echo "Free space must stay above ~10-15% so macOS can update and swap."

hr "TOP-LEVEL HOME FOLDERS (largest first)"
du -sh "$HOME"/* "$HOME"/.[!.]* 2>/dev/null | sort -rh | head -15

hr "LIBRARY FOLDERS (largest first)"
du -sh "$HOME"/Library/* 2>/dev/null | sort -rh | head -15

hr "SAFE-TO-CLEAR LOCATIONS"
for p in \
  "$HOME/.Trash" \
  "$HOME/Library/Caches" \
  "$HOME/Library/Logs" \
  "$HOME/Library/Developer/Xcode/DerivedData" \
  "$HOME/Library/Developer/Xcode/Archives" \
  "$HOME/Library/Developer/CoreSimulator" \
  "$HOME/Library/Containers/com.apple.mail/Data/Library/Mail Downloads" \
  "$HOME/Library/Application Support/MobileSync/Backup" \
  "$HOME/Library/Caches/Homebrew" \
  "$HOME/.npm/_cacache" \
  "$HOME/.cache" \
  "$HOME/Library/Caches/pip" \
  "$HOME/Library/Caches/com.apple.bird" \
  "$HOME/Library/Group Containers/group.com.apple.CoreSpeech"
do
  [ -e "$p" ] && printf '%8s  %s\n' "$(size_of "$p")" "$p"
done

hr "DOWNLOADS: installers and archives (dmg/pkg/zip/iso)"
find "$HOME/Downloads" -maxdepth 2 -type f \( -iname '*.dmg' -o -iname '*.pkg' -o -iname '*.zip' -o -iname '*.iso' \) -exec du -sh {} + 2>/dev/null | sort -rh | head -20

hr "LARGEST 30 FILES IN YOUR HOME FOLDER (over 500 MB)"
find "$HOME" -type f -size +500M -not -path '*/Library/Mobile Documents/*' -exec du -sh {} + 2>/dev/null | sort -rh | head -30

hr "LARGEST APPLICATIONS"
du -sh /Applications/*.app 2>/dev/null | sort -rh | head -15

hr "iPHONE / iPAD BACKUPS ON THIS MAC"
B="$HOME/Library/Application Support/MobileSync/Backup"
if [ -d "$B" ] && [ -n "$(ls -A "$B" 2>/dev/null)" ]; then
  du -sh "$B"/* 2>/dev/null | sort -rh
  echo "(Delete old ones in Finder > your device > Manage Backups, or run the cleanup script with --backups)"
else
  echo "None found."
fi

hr "TIME MACHINE LOCAL SNAPSHOTS (these can silently hold many GB)"
tmutil listlocalsnapshots / 2>/dev/null || echo "None or Time Machine not configured."

hr "HOMEBREW"
if command -v brew >/dev/null 2>&1; then
  echo "Installed. Cache size: $(size_of "$(brew --cache 2>/dev/null)")"
  echo "Run 'brew cleanup -s' to clear old versions and downloads."
else
  echo "Not installed."
fi

hr "DONE"
echo "Report saved to: $REPORT"
echo "Next: run  bash mac-storage-cleanup.sh        (dry run, shows what would be removed)"
echo "      run  bash mac-storage-cleanup.sh --apply (actually removes it)"
