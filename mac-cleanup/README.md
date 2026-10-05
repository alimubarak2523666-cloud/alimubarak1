# Mac storage test and cleanup

Two scripts to run on the MacBook Air itself.

## 1. Test (safe, deletes nothing)

Open **Terminal** (Cmd+Space, type Terminal), then:

```bash
cd ~/Downloads/mac-cleanup
bash mac-storage-report.sh
```

It prints what is using the space and saves a copy to `~/Desktop/storage-report.txt`.

## 2. Clean up

Dry run first. It only lists what it would remove:

```bash
bash mac-storage-cleanup.sh
```

If the list looks fine, delete for real:

```bash
bash mac-storage-cleanup.sh --apply
```

It clears only disposable data: Trash, caches, logs, installers in Downloads older than 30 days,
Xcode build output, Homebrew leftovers, and Time Machine local snapshots.
It never touches Documents, Desktop, Photos, Mail messages, or installed apps.

Optional: `--backups` also removes iPhone/iPad backups stored on the Mac. Only use it if those
devices back up to iCloud.

## 3. Things only you can decide (do these in System Settings)

- **Photos**: Photos > Settings > iCloud > *Optimise Mac Storage*.
- **Apps**: System Settings > General > Storage > Applications, sort by size, remove what you do not use.
- **Big files**: the report lists every file over 500 MB. Move old videos or disk images to an external drive or iCloud Drive.
