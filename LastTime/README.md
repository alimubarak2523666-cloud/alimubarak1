# Last Time

A simple iPhone app that tracks the last time you did the little things,
like changing your toothbrush, calling Mom, or watering the plants.

- One tap marks something as done today; the list shows "12 days ago".
- Optional reminders ("every 30 days") send a notification when it's time.
- Home Screen widgets (small, medium, large) with a tap-to-done button, and
  Lock Screen widgets.
- English and Arabic (full right-to-left), with correct Arabic plurals.
- Works on every iPhone that runs iOS 17 or later (iPhone XS / XR and newer):
  small screens, Pro Max, and both screens of iPhone Fold. On wide screens
  (Fold opened, Pro Max in landscape) the list and details sit side by side.
- No account, no server, no tracking: all data stays on the phone.

## Run it

1. Open `LastTime/LastTime.xcodeproj` in Xcode (16 or newer).
2. Select the **LastTime** target → **Signing & Capabilities** → choose your
   **Team**. Do the same for **LastTimeWidgetExtension**. Xcode registers the
   App Group `group.com.alimubarak1.lasttime` that the app and widget share.
3. Pick a simulator or your iPhone and press **Run** (⌘R).

To try Arabic: Product → Scheme → Edit Scheme → Run → Options →
App Language → Arabic.

## Project layout

```
LastTime/            the app: list, details, add/edit screens, icon
LastTimeWidget/      Home Screen and Lock Screen widgets
Shared/              used by both: data model, database, reminders,
                     the widget's "done" action, English/Arabic text
```

## Before the App Store

- If the bundle ID `com.alimubarak1.lasttime` is taken, change it (and the
  widget's `com.alimubarak1.lasttime.widget`) in both targets' build settings.
- Bump **Version** / **Build** in the target's General tab for each upload.
- Product → Archive → Distribute App → App Store Connect.
- In App Store Connect, the privacy answer is "Data Not Collected".
