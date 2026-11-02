# Minutes IA overhaul: current state and problems

Status: draft, local only (`design/ia-overhaul`). Snapshot of `upstream/main` @ afee87f3, 2026-11-01.
Scope: desktop app (main window, Settings, tray, menus, palette, secondary windows, notifications), CLI, MCP, plugin skills.
Direction set so far: the top level is built around two jobs — **record & review meetings** and **work with an AI agent**. Search, dictation and quick capture live inside or alongside those, not as peers.

Inventories (evidence for everything below):
- [01 — main window](01-inventory-main-window.md)
- [02 — CLI, MCP, skills](02-inventory-cli-mcp.md)
- [03 — tray, menus, palette, windows, shortcuts, notifications](03-inventory-desktop-entry-points.md)
- UX heuristics audit, 2026-11-01 (scored 4/10): summarized in chat; findings referenced here where structural.

## How it's organized today

```
Desktop
├─ Main window
│  ├─ Header: brand · ⚙ · Jobs N · Recovery N · status pill   (Dictation + Readiness chips: never shown)
│  ├─ Search row: ‹ · Recall pill · Documents pill · search
│  ├─ Up to ~11 stacked banners (recording, live, processing, output, quick note, config,
│  │   upcoming, call detected, call ended, Parakeet, update)
│  ├─ List: meetings  ⇄  documents (same container)
│  ├─ Footer: [Start Recording] · meeting audio · microphone · MEETING|MEMO|LIVE
│  ├─ Panes: Recall (chat or terminal) · Document viewer
│  └─ Modals: Meeting detail · Create Draft · Settings · Readiness · Recovery · Jobs · About ·
│     What's New · CLI setup · Coach onboarding · Consent · Input
├─ Tray: calendar · record · quick thought · sensitive · stop · Coach · mute · note ·
│        dictation recovery ×3 · Recall · folder · copy summary/transcript · screen-share · updates · quit
├─ App menu: About · What's New · Settings · Add Note · Open folder · Help links
├─ Palette (⌘⇧K): recording · dictation · navigation · search · current-meeting actions
├─ Windows: Add Note · Upcoming Meeting prompt · Dictation overlay · Coach HUD · (orphaned terminal)
└─ Notifications: no click actions
CLI: ~61 flat commands, no grouping
MCP: 34 tools, 11 resources, prompts only in manifest
Skills: 25
```

## Problems, ranked

### 1. No shared object model (severity: high, every surface)
The same things have different names on every surface and sometimes within one screen.

| Concept | Names in use |
|---|---|
| A saved conversation | meeting, recording, capture, memo, quick thought, idea, note |
| AI-written file | document, draft, artifact |
| AI chat | Recall, agent, assistant, chat, terminal, "AI Assistant", "Minutes Assistant" |
| Live coaching | Coach, copilot (CLI/MCP/code), "ask your agent in Recall for coaching" |
| Who spoke | speaker, voice, voiceprint, voice profile, person, people |
| Background work | jobs, processing jobs, processing, queued; recovery is separate |

Without one vocabulary, navigation labels can't be predictable and the CLI/MCP can't mirror the app.

### 2. The two core jobs have no home (high)
- **Meetings**: the list is the home screen, but the **detail is a full-window modal**. It can't sit next to Recall or a draft, so "review a meeting with the agent" means closing the meeting.
- In the detail, **Summary and Transcript come after nine derived sections** (Decisions, Next Steps, Context, Speakers, Related People/Topics, Commitments, Nearby Meetings, Drafts).
- **Agent**: Recall is a pill that hides itself when open, a tray item, ⌘⇧R, four "Discuss with Agent" buttons and two auto-open triggers. It has five phases (Recall/Prep/Listening/Debrief/Weekly), two modes (Chat/Terminal), and owns Weekly. Drafts live in a separate "Documents" list that replaces the meeting list.

### 3. Capture is everywhere and nowhere (high)
- Desktop: footer button + mode picker *below* it, tray (Start Recording, Quick Thought, Sensitive), palette, calendar prompt, call banner, hotkeys (mostly off by default).
- Quick Thought is labelled "Memo" in the footer and "Quick Thought" everywhere else.
- CLI: ~10 capture entry points (`record`, `live`, `dictate`, `talk`, `sensitive`, `process`, `import`, `watch`, `transcribe`, `demo`) with overlapping `--mode` / `--intent` / content-type vocabulary.

### 4. Settings is organized by implementation, not by task (high)
- "AI & Privacy" holds ~10 unrelated groups: search, Coach, summarization, pipeline hooks, calendar, call detection, privacy, consent, desktop context, vault, Recall agent.
- "Capture" contains only live transcript and palette shortcuts; meeting audio, microphone, call detection, calendar and consent are elsewhere or not in Settings at all.
- Settings shortcuts land on the wrong tab ("Calendar settings…" → Capture).
- Duplicate controls (sound cues in two tabs). Three heading styles.

### 5. Status and system surfaces are fragmented and partly invisible (medium)
- Jobs Center, Recovery Center and Readiness Center are three separate modals. Two header chips that should surface problems never render.
- Up to ~11 banners stack above the list with no priority.
- Notifications have no click actions, so they can't take you to what they announce.

### 6. Entry points are inconsistent across surfaces (medium)
- Many features exist on exactly one surface (tray-only Coach start, Mute, screen-share toggle, Copy Latest Summary; palette-only search, open latest meeting, rename, confirm speaker; app-menu-only About/What's New).
- The same action has different labels per surface (Start recording ×5 variants, Add Note ×4, Recall ×4).
- Some routes go somewhere unexpected: palette "Open latest meeting" opens the `.md` in another app; "Open assistant workspace" opens Finder, not Recall.

### 7. CLI and MCP don't mirror the product (medium)
- CLI help is flat and in declaration order: a recovery tool first, maintainer tools visible, core commands (`get`, `delete`, `confirm`) last. Legacy duplicates (`enroll`, `voices`) beside `voice`.
- MCP verbs are mixed (`get_/read_/list_/search_/track_`), start/stop pairs are incomplete (no `stop_live_transcript`), stubs are advertised.
- Drafts exist only on desktop.

### 8. Broken or dead paths found along the way (fix independently)
- Palette search/research/actions/decisions/upcoming/read-live results are discarded.
- Readiness and Dictation header chips never render.
- "Calendar settings…" opens the wrong tab.
- `terminal.html` is orphaned.
- Coach HUD has no Stop.

## Constraints to respect

- `docs/plans/tauri-design-pass.md` (maintainer, "Planning", July 2026) covers visual polish and explicitly keeps layout changes out of phase 1. IA work restructures layout, so it overlaps that plan's phases 2–3; coordinate before proposing upstream.
- Proven decisions in `CLAUDE.md` stand: recording is never degraded by optional consumers; wrong speaker names are worse than none; auto-update stays off.
- Capture blue means recording; red is for errors only; WCAG AA; tokens only.

## Decisions

| # | Question | Decision | Date |
|---|---|---|---|
| 1 | What is the saved thing called? | **Meeting**, with **Memo** as a kind (replaces recording, capture, quick thought, idea) | 2026-11-02 |
| 2 | What is the AI surface called? | **Assistant** (replaces Recall, agent, AI Assistant, Minutes Assistant) | 2026-11-02 |
| 3 | Meeting detail: pane or page? | **Pane** beside the list, so a meeting and the Assistant can be open together | 2026-11-02 |
| 4 | Where do drafts belong? | **Inside their meeting**; the Assistant can create them; the separate Documents list goes away | 2026-11-02 |
| 5 | Where does Coach belong? | *Proposed:* with recording (it only runs during capture) | pending |
| 6 | Dictation | *Proposed:* a utility (overlay + tray + Settings), not a top-level area | pending |

Proposed structure: [04 — proposed structure](04-proposed-structure.md).
