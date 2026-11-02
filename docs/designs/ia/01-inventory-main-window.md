# IA inventory: main window

Snapshot of `upstream/main` @ afee87f3, 2026-11-01. Source: `tauri/src/index.html` (+ `scripts/dictation-readiness.js`, `dictation-experience.js`, `recall-chat.js`).

## Defects found while inventorying

- **Readiness and Dictation header chips never appear.** `.header-chip.readiness {display:none}` (l.1267) comes after `.header-chip.active` and wins, so the dictation-setup nudge is invisible; nothing ever adds `.active` to `#btn-dictation`. The only visible in-window route to Readiness is Settings › Advanced › Diagnostics. *(verified)*
- **"Calendar settings…"** (upcoming card × menu) opens the Capture tab; Calendar lives under AI & Privacy. *(verified)*
- **Sound cues set in two places**: General "Play sound cues…" and Dictation "Sound cues" (caption says it also controls recording sounds).

## Chrome

- **Header**: brand · hidden Dictation chip · ⚙ Settings · hidden Readiness chip · "Jobs N" (only while jobs run) · "Recovery N" (only when items exist) · status pill.
- **Search row**: `‹` collapse list (⌘B; disabled unless another pane is open) · "Recall" pill (hides while Recall is open; red nudge dot when auto-open was suppressed) · "Documents" pill (swaps list contents; flips to "Meetings") · search "Search recordings..." (⌘F).

## Stacked banners/bars in the list pane (DOM order)

Recording bar (Coach · Add Note · Stop Recording) · Live bar (Coach · Stop Live; mic-only warning) · Processing bar · Output notice (Saved meeting / Capture preserved / Needs attention / Recording not started / Coach not started / Live transcript failed) · Quick note · Config warning · Upcoming-meeting card (Record, × menu) · Call-detected banner · Call-ended countdown · Parakeet upgrade banner · Update banner.

Up to ~11 different banners compete for the top of the list pane.

## Meeting list

Date-grouped rows (title, time, snippet, lifecycle badges, ➜ Discuss with Agent, type badge). Right-click menu = Open · Discuss with Agent · detail ⋯ items. Search by meaning regroups into Title matches / Related by meaning / Other mentions. States: loading, no matches, load error, **first-run setup card** (replaces the list and hides the footer).

**Documents view** reuses the list container: filename rows, "No documents yet.", search disabled.

## Footer capture area

Primary button (label by mode: Start Recording / Record Memo / Go Live) · Meeting audio select (Meeting mode only; Start disabled until chosen) · Microphone select · mode picker MEETING · MEMO · LIVE (below the button). While capturing: button and pickers hide; Stop lives in the recording/live bar.

## Panes and layout

List · Recall · Document viewer, left to right; all three can be open. With a doc open the list pins to 22% and the doc takes 34%. List auto-collapses below 720px (1000px with a doc). Below 820px the doc floats over Recall.

**Meeting detail is a full-window modal**, not a pane, so it never coexists with Recall or the document; "Discuss with Agent" closes it to open Recall.

### Recall panel
Header: phase (Recall / Prep / Listening / Debrief / Weekly) · Weekly · End Session (terminal mode) · Chat⇄Terminal toggle · ×. Body: quick note (Listening), loading, provider notice, weekly view, xterm terminal **or** native chat, session-ended banner.
Entry: Recall pill, ⌘⇧R, four "Discuss with Agent" buttons, tray Recall, auto-open on recording stop (Debrief) and upcoming meeting (Prep), launch restore.

### Document viewer
Header: × · filename · "MD". Toolbar: Preview / Source · Make Editable Copy · Save · Review · Revert · status. Recent-docs strip, Last Change Review.
Entry: Documents row, Create Draft, detail Drafts row, ⌘O ("Open artifact file"), palette "Create debrief draft", launch restore.

## Modals and overlays

| Surface | Entry points |
|---|---|
| Meeting detail | list row, output notice Open, restore |
| Create Draft picker (Debrief Memo / Follow-up Email / Meeting Brief / Decision Memo) | detail "Create Draft" |
| Input modal (rename, confirm speaker) | detail actions |
| Readiness Center | hidden chip, Settings › Diagnostics, dictation permission buttons, overlay event |
| Recording consent ("Before you record") | start when consent required |
| Recovery Center | header chip, Settings › Diagnostics |
| Jobs Center | header chip only |
| About | app menu only |
| Settings | ⚙, ⌘,, app menu, About, Coach onboarding, upcoming × menu, dictation history shortcut |
| Coach onboarding | auto 1.2s after first launch, Settings Coach "How it works", first Coach enable |
| What's New | auto after update, About, app menu |
| CLI setup | About CLI card, What's New |

Transient: action toast (Undo, ⌘Z), detail feedback banner, native confirms (Restart, Unsaved Changes, Revert to Snapshot).

## Meeting detail anatomy

Header: × · title · meta chips · Discuss with Agent · **Create Draft** (primary) · ⋯ (Resummarize · Rename… · Copy as Markdown · Open in Editor · Show in Finder · Copy Path · Archive).

Body (each only if data): Decisions · Next Steps (checkable) · Context · Speakers (Remember / Confirm) · Related People · Related Topics · Open Commitments · Nearby Meetings · Drafts · Sensitive Meeting · file sections (Summary / Notes / Transcript…) · "Have questions…? Discuss with Agent".

Note: Summary and Transcript come **after** nine derived sections.

## Settings tree

Tabs: General · Capture · Dictation · Transcription · AI & Privacy · Advanced. Every tab ends with "Config file: {path}". Toggles are On/Off buttons, not switches.

- **General**: IDENTITY (name, emails, name variants) · GENERAL (language, completion alerts, Critical Coach alerts, sound cues, open at login, Quick Thought shortcut)
- **Capture**: LIVE TRANSCRIPT (backend, shortcut) · COMMAND PALETTE (shortcut)
  - *Meeting audio, microphone, call detection, calendar and consent are not here.*
- **Dictation** (own visual language: h2/h3 + disclosures; sub-tabs):
  - Writing: readiness checks · shortcut · practice field · where text goes · sound cues · writing style · Advanced (engine, model, voice-edit commands, daily note, silence timeout) · Writing for specific apps · Delivery and recovery shortcuts
  - Words & snippets: personal dictionary · snippets
  - Microphone: input selection, preferred list, test
  - Recent text: history, review/recover, local AI edit
- **Transcription**: engine · Whisper model · Parakeet backend · language · speaker diarization
- **AI & Privacy** (catch-all, ~10 groups in one scroll):
  SEARCH BY MEANING · COACH (own kicker style) · AUTO-SUMMARIZATION (engine + per-engine fields, API key) · PIPELINE HOOKS · CALENDAR · CALL DETECTION (9 controls) · PRIVACY (screen-share hiding, consent reminder, disclosure script, frontmatter basis, desktop-context toggles, allowed/denied apps, screen context) · VAULT SYNC · RECALL AGENT
- **Advanced**: STORAGE · DIAGNOSTICS (Readiness, Recovery) · ADVANCED (Edit config.toml, docs)

Three heading styles across tabs: uppercase dividers, Dictation's h2/h3, Coach's kicker + serif title.

## Naming in the main window

| Concept | Terms used |
|---|---|
| The saved thing | recording · meeting · capture · memo · quick thought · dictation |
| Short capture | "Memo" (mode, badge, Retry as Memo) **and** "Quick Thought" (shortcut, status pill, processing, jobs) |
| AI output files | Documents (pill) · Drafts (button, detail section) · artifacts (⌘O dialog, confirms, onboarding) |
| AI chat | Recall (pill, panel) · Agent ("Discuss with Agent" ×4, "ask your agent in Recall") · Assistant (errors, notices) · Chat / Terminal (modes) |
| Live coaching | Coach (feature) and "ask your agent in Recall for coaching" (Live tooltip) |
| Live | Live / Go Live / Live Transcript / Stop Live / Live meeting / standalone live transcript |
| Background work | Jobs / Jobs Center / processing / queued, separate from Recovery / Recovery Center |
