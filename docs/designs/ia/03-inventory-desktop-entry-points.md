# IA inventory: desktop entry points outside the main window

Snapshot of `upstream/main` @ afee87f3, 2026-11-01. MW = main window (`index.html`).

## Defects found while inventorying

- **Palette discards results.** `palette/index.html` calls `invoke("palette_execute")`, ignores the response and closes. Search transcripts…, Research topic…, Find open action items, Find recent decisions, Show upcoming meetings and Read live transcript compute results (`palette_dispatch.rs` returns `SearchResults` etc.) that are never shown. *(verified)*
- **`terminal.html` is orphaned.** `show_terminal_window` has no callers; Recall moved into MW. *(verified)*
- "Copy Latest Summary/Transcript" (tray) copies **and pastes** into the frontmost app.
- The meeting prompt's Record button starts without the event title; the tray calendar item passes it.
- Some tray labels skip `tr()` ("Coach", "Starting Quick Thought…", "Stopping...", "Stop Sensitive Meeting", calendar-access item); palette titles aren't localized.
- `Cmd+Shift+T` is offered as an alternative for two different shortcut slots.

## Tray menu (`main.rs`)

Icon/tooltip reflect activity (Recording > Live > Dictation > Voice > Coach > Idle). Clicking the icon opens the menu.

1. Open Minutes
2. — Calendar block (Now / Starts in Xm / Today / Tomorrow; ≤10 events; click → MW starts recording with event title)
3. Start Recording (→ MW performs start)
4. Quick Thought (starts directly, no MW)
5. Sensitive Meeting ⇄ Stop Sensitive Meeting (stop opens MW Recall with debrief prompt)
6. Stop Recording / Stop Live Transcript / Stop Dictation / Stop Coach / Close Voice (label follows activity)
7. Coach / Coach ✓ (opens Coach HUD)
8. Voice / Voice ✓ (feature build only)
9. Mute My Mic (Recording Only)
10. — Add Note... (note window)
11. Copy Last Dictation · Paste Last Dictation · Reprocess Last Dictation
12. Recall (→ MW Recall panel; error titled "AI Assistant")
13. Open Meetings Folder
14. Copy Latest Summary · Copy Latest Transcript
15. — Hide from Screen Share ✓
16. Check for Updates
17. Quit Minutes

## App menu bar

- **Minutes**: About Minutes · What's New… · Settings… (⌘,) · Check for Updates… · Services/Hide/Quit
- **File**: Open Minutes · Add Note… (⌘⇧N) · Open Meetings Folder · Close Window
- **Edit**: standard · **View**: Fullscreen · **Window**: Minimize/Maximize/Bring All to Front/Close
- **Help**: Minutes Website · Release Notes · Get Help (Discussions)

## Command palette

Separate always-on-top window (640×420). Opens with global ⌘⇧K (on by default) or ⌘K inside MW. Not reachable from tray or menus. One flat list with a section badge per row; up to 5 recents first.

| Section | Commands |
|---|---|
| Recording | Start recording · Stop recording · Add note to current recording · Start/Stop live transcript · Read live transcript* · Start/Stop sensitive meeting |
| Dictation | Start/Stop dictation · Copy last dictation · Paste last dictation · Copy raw last dictation · Reprocess last dictation |
| Navigation | Open latest meeting (opens `.md` in OS default app, not MW) · Open latest meeting from today · Show upcoming meetings* · Open meetings folder · Open memos folder · Open assistant workspace (Finder, not Recall) |
| Search | Search transcripts…* · Research topic…* · Find open action items* · Find recent decisions* |
| Meeting (needs current meeting) | Copy meeting markdown · Create debrief draft · Confirm speaker name · Rename current meeting |

\* result discarded (see Defects).

## Other windows

| Window | Size / type | Opened by | Notes |
|---|---|---|---|
| `note` "Add Note" | 420×260, always on top | tray Add Note..., File › Add Note… | adapts to recording / sensitive / idle |
| `meeting-prompt` "Upcoming Meeting" | 380×240 frameless, top-right (assumes 1440px screen) | calendar, ≤3 min before event | Join & Record / Record / Dismiss |
| `dictation-overlay` | 320×88 HUD, draggable | any dictation start | Finish / Cancel / Recover text / Download / Open Settings |
| `copilot-hud` "Coach" | 572×279 HUD, bottom-center | tray Coach, MW | Pause/Resume, Dismiss; **no Stop** |
| `palette` | 640×420 | ⌘⇧K / ⌘K | see above |
| `terminal` | 900×600 | nothing (orphaned) | |

## Global shortcuts

| Slot | Default | On by default |
|---|---|---|
| Quick Thought (hold or tap) | ⌘⇧M | no |
| Dictation | ⌘⇧Space (or Caps Lock / fn) | no |
| Live transcript | ⌘⇧L | no |
| Palette | ⌘⇧K | **yes** |
| Paste last dictation | ⌘⌥V | no |
| Recent dictations | ⌘⌥D | no |

## Notifications

None have click actions or buttons; clicking only activates the app. Types: call detected (+ repeat reminder), auto-record started/failed, call-ended countdown (MW banner), processing complete, recording not started/blocked, dictation/quick-thought errors, Coach urgent watch (opt-in), palette first run, updates, tray action results.

## External control

No URL scheme. A file queue (`~/.minutes/desktop-control/`) accepts only StartRecording, used by MCP `start_recording`.

## Features reachable from only one entry point (outside MW)

- Tray only: Quick Thought (hotkey off by default), Coach start, Mute My Mic, Hide from Screen Share, Copy Latest Summary/Transcript, Recall, calendar click-to-record
- App menu only: About, What's New, Settings (⌘,), Help links
- Palette only: live transcript start, dictation start (hotkeys off by default), Copy raw last dictation, Open latest meeting, Open memos folder, Open assistant workspace, all search commands, Copy meeting markdown, Create debrief draft, Confirm speaker name, Rename current meeting
- Hotkey only: Recent Dictations

## Same feature, different names

| Feature | Labels |
|---|---|
| Start recording | "Start Recording" (tray) · "Start recording" (palette) · "Join & Record" / "Record" (prompt) · "Record" (call banner) · "Open Minutes to start recording" (notification) |
| Stop | per-activity tray labels · palette "Stop …" · "Stop now" (countdown) · overlay "Finish dictation" |
| Add note | "Add Note..." · "Add Note…" · "Save Note" · "Add note to current recording" |
| Recall | "Recall" (tray) · "AI Assistant" (error) · "Open assistant workspace" (palette, opens Finder) · "Minutes Assistant" |
| Upcoming meetings | tray headers · "Upcoming Meeting" · "Show upcoming meetings" |
| Dictation recovery | "Copy/Paste/Reprocess Last Dictation" · "Copy raw last dictation" · "Recover text" · "Recovered dictation" |
| Coach | "Coach" / "Coach ✓" / "Stop Coach" · "Coach Listening..." · "Coach · Private" · copilot in code |
| Quick Thought | "Quick Thought" · "Quick thought" · "record a quick thought" · "Memo" (MW mode) |
