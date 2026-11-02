# Minutes IA overhaul: proposed structure

Status: **draft for discussion**, local only. Builds on [00 — current state](00-current-state.md) and decisions 1–4 there. Items marked *(proposed)* are not yet decided.

Principles:
1. **One vocabulary** across the desktop app, CLI, MCP and skills.
2. **Two homes**: Meetings (record, review) and Assistant (ask, draft). Everything else is a utility or a setting.
3. **Every core action has one canonical place** in the window, and the same name on every other surface that offers it.
4. **Settings follow tasks**, not subsystems.
5. **Status has one home**; banners have a priority order.

---

## 1. Vocabulary

| Term | Means | Replaces |
|---|---|---|
| **Meeting** | Any saved conversation. Kinds: **Meeting**, **Memo** | recording, capture, quick thought, idea, conversation |
| **Memo** | A short solo recording (brain dump, voice memo) | quick thought, idea, "Record Memo" vs "Quick Thought" |
| **Note** | Text you add to a meeting, during or after | quick note, marker (sensitive meetings keep "marker" internally) |
| **Transcript** | What was said, with speakers | — |
| **Summary** | AI summary inside a meeting | — |
| **Action items · Decisions** | Structured items in a meeting | next steps, commitments (commitments = action items across meetings) |
| **Draft** | An AI-written document made from a meeting (brief, follow-up, debrief, decision memo) | document, artifact |
| **Assistant** | The AI chat about your meetings. "Chat" and "Terminal" are two *views* of it | Recall, agent, AI Assistant, Minutes Assistant |
| **Coach** | Private live suggestions during a recording | copilot (stays internal only) |
| **Live transcript** | Real-time transcript while recording | Live, Go Live, standalone live transcript |
| **Dictation** | Speech to text into other apps; not saved as a meeting | — |
| **People** | People who appear in meetings | person, relationships |
| **Voice profile** | A person's enrolled voice, used to name speakers | voice, voiceprint, enrollment |
| **Speaker** | An unnamed voice in one transcript ("Speaker 1") | SPEAKER_0 in UI |
| **Activity** | Background processing, recovery and readiness, in one place | Jobs, Jobs Center, Recovery Center, Readiness Center |

Rules:
- Buttons are verbs + the vocabulary noun: "Record meeting", "Record memo", "Ask Assistant", "New draft", "Add note".
- Sentence case for all labels and buttons (no all-caps buttons).
- Internal names (`copilot`, `artifact`, `content_type`) never reach the UI.

## 2. Desktop main window

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ m   [● Record meeting ▾]          status        Activity •   Assistant   ⚙ │  top bar
├──────────────┬───────────────────────────────┬──────────────────────────────┤
│ Search       │ Meeting                        │ Assistant  (toggle)          │
│ All·Meetings·│ Title · date · people          │  chat about this meeting,    │
│ Memos        │ [Ask Assistant] [New draft] ⋯  │  or all meetings             │
│              │ Overview | Transcript | Drafts │                              │
│ Today        │  Summary                       │  Draft opens here or as a    │
│  Meeting A   │  Action items · Decisions      │  third pane                  │
│  Memo B      │  Notes                         │                              │
│ Yesterday    │  Related (people, topics,      │                              │
│  …           │  nearby meetings)              │                              │
└──────────────┴───────────────────────────────┴──────────────────────────────┘
```

### Top bar
- **Record** split button: primary action records a meeting; the menu offers Memo, Live transcript, Sensitive meeting. Replaces the footer button + mode picker below it. During capture it becomes the **recording control** (timer, level, Coach, Add note, Stop) in place.
- **Status**: one line (recording, processing, saved).
- **Activity** (badge when something needs attention): processing queue, preserved captures to retry, readiness problems. Merges three modals and the two header chips that never render.
- **Assistant** toggle (⌘⇧R), **Settings** (⌘,).

### Sidebar (Meetings)
- Search with scope chips **All · Meetings · Memos**; filters later (people, date).
- Date-grouped list. Selecting a row opens it in the meeting pane (no modal).
- The Documents list goes away (drafts live in meetings).

### Meeting pane
- Header: title, date, duration, people · **Ask Assistant** · **New draft** · ⋯ (Resummarize, Rename, Copy as Markdown, Open in editor, Show in Finder, Archive).
- Tabs:
  - **Overview**: Summary → Action items → Decisions → Notes → Related (people, topics, open commitments, nearby meetings). Summary first; today it comes after nine derived sections.
  - **Transcript**: speakers, naming ("Speaker 1 → Alex"), search within.
  - **Drafts**: drafts made from this meeting; "New draft" templates.
- Sensitive meetings show markers and "Run debrief" in Overview.

### Assistant pane
- Scoped to the open meeting by default ("About: Q2 Cut Lines"), switchable to "All meetings". Replaces the five phases (Recall/Prep/Listening/Debrief/Weekly) with a scope plus suggested prompts (Prep, Debrief, Weekly summary).
- Chat by default; Terminal as a view option for power users. Setup/sign-in happens in a dedicated empty state, not inside a terminal's own onboarding.
- Drafts it creates attach to the meeting and open beside it.

### Banners
One notification area above the list with a priority order and at most one visible banner (others queue):
1. Errors that block recording (config unreadable, recording not started)
2. Active capture problems (mic-only live, device lost)
3. Call detected / call ended countdown
4. Upcoming meeting
5. Info (saved, update available, upgrade offers)

## 3. Utilities (not top-level)

- **Dictation**: overlay + tray + shortcuts; history and dictionary in Settings › Dictation. *(proposed, decision 6)*
- **Coach**: started from the recording control or tray; its settings live in Settings › Recording. *(proposed, decision 5)* Coach HUD gains a Stop control.
- **Add note**: recording control, tray, File menu, palette, ⌘⇧N. One label: "Add note".
- **Command palette** (⌘K / ⌘⇧K): mirrors the window's actions with the same names; results open in the window (search opens the sidebar with the query; "Open latest meeting" opens it in the meeting pane, not another app).

## 4. Settings

| Tab | Contents (from today's tabs) |
|---|---|
| **General** | Identity · Language · Open at login · Notifications · Sound cues (one control) |
| **Recording** | Meeting audio · Microphone · Live transcript · Coach · Call detection & auto-record/stop · Calendar suggestions · Consent reminder & disclosure script · Default consent basis |
| **Transcription** | Engine · Model · Language · Speaker identification · Voice profiles · Vocabulary |
| **Dictation** | As today (Writing · Words & snippets · Microphone · Recent text), restyled to match other tabs |
| **Assistant & AI** | Assistant app (agent CLI) + Chat/Terminal · Auto-approve · Summarization engine & keys · Search by meaning · After-recording command |
| **Privacy & data** | Hide from screen sharing · Desktop & screen context · Storage & retention · Vault sync |
| **Shortcuts** | Every global shortcut in one list: record memo, dictation, live transcript, palette, paste last dictation, recent dictations |
| **Advanced** | Activity/diagnostics links · Edit config file · Configuration reference |

Also: one heading style across tabs; real switches with `aria-pressed`/`role="switch"`; deep links land on the right section ("Calendar settings…" → Recording › Calendar).

## 5. Entry points

Rule: every core action is in the window and the palette, with identical names. The tray holds capture and quick actions. The menu bar mirrors the window.

| Action | Window | Tray | Menu bar | Palette | Shortcut |
|---|---|---|---|---|---|
| Record meeting | Record ▾ | ✓ | File › Record meeting | ✓ | optional |
| Record memo | Record ▾ | ✓ | File › Record memo | ✓ | ⌘⇧M (hold/tap) |
| Live transcript | Record ▾ | ✓ | File | ✓ | ⌘⇧L |
| Sensitive meeting | Record ▾ | ✓ | File | ✓ | — |
| Stop | recording control | ✓ | File | ✓ | — |
| Add note | recording control, meeting ⋯ | ✓ | File › Add note | ✓ | ⌘⇧N |
| Coach on/off | recording control | ✓ | — | ✓ | — |
| Search | sidebar | — | Edit › Find | ✓ (opens sidebar) | ⌘F |
| Open meeting | sidebar | latest | — | ✓ | — |
| Ask Assistant | top bar, meeting header | ✓ | View › Assistant | ✓ | ⌘⇧R |
| New draft | meeting header | — | — | ✓ | — |
| Activity | top bar | — | View › Activity | ✓ | — |
| Settings | top bar | — | Minutes › Settings | ✓ | ⌘, |
| Dictation | — (utility) | recovery items | — | ✓ | ⌘⇧Space |

Notifications get click actions that open what they announce (saved meeting → meeting pane; call detected → Record).

## 6. CLI

Same nouns as the app. Help grouped with headings and core commands first.

| Heading | Commands |
|---|---|
| Record | `record` (`--memo`, `--live`, `--sensitive`), `stop`, `note`, `extend`, `mic-toggle`, `dictate` |
| Meetings | `list`, `get`, `search`, `delete`, `export`, `import`, `process`, `resummarize`, `template` |
| Insights | `actions`, `decisions`/`insights`, `commitments`, `consistency`, `research`, `people`, `person` |
| Assistant & Coach | `coach` (primary; `copilot` alias), `talk`, `transcript` |
| People & voices | `voice {enroll,list,test,remove,delete-all}`, `confirm`, `vocabulary` |
| Setup & status | `setup`, `health`, `status`, `activity` (jobs), `devices`, `logs`, `paths`, `storage`, `cleanup`, `service`, `watch`, `vault`, `semantic` |
| Developer (hidden or last) | `recover-stem`, `apple-speech`, `capabilities`, `schema`, `events`, `agent-annotate`, `qmd`, `demo`, `dashboard` |

Deprecate with aliases and warnings: `enroll` → `voice enroll`, `voices` → `voice list`, `sources` → `devices --grouped`, `record --mode quick-thought` → `record --memo`.

## 7. MCP

- Naming: `verb_noun`; `list_*` for many, `get_*` for one, `search_*` for queries; status tools named `get_<thing>_status`.
- Complete pairs: add `stop_live_transcript`.
- Coach: `start_coach` / `stop_coach` / `get_coach_status` / `read_coach_suggestions`, with the `copilot` names kept as deprecated aliases.
- Drafts: `list_drafts`, `get_draft`, `create_draft` so agents reach what the desktop creates.
- Stop advertising permanently unavailable stubs.
- Register the manifest prompts in the server, or drop them in favor of skills.

Breaking renames need an alias window; MCP clients pin tool names.

## 8. Migration and sequencing (sketch)

1. **Vocabulary pass** (labels only, no layout): sentence case; Memo/Quick Thought → Memo; Recall/Agent → Assistant; Documents/artifact → Drafts; jargon removal in Settings. Low risk, high consistency.
2. **Fix dead paths** found in [00 §8](00-current-state.md#8-broken-or-dead-paths-found-along-the-way-fix-independently) — independent, upstream-friendly.
3. **Settings reorganization** (move controls between tabs; add Shortcuts tab).
4. **Activity** (merge Jobs/Recovery/Readiness) and banner priority.
5. **Layout**: meeting pane, top-bar Record, Assistant scoping, drafts in meetings.
6. **CLI help grouping + deprecations; MCP aliases.**

Steps 1–2 could go upstream early; 3–6 overlap `docs/plans/tauri-design-pass.md` phases 2–3 and need the maintainer's buy-in.

## Open questions

- Decisions 5 (Coach placement) and 6 (Dictation) — confirm or change.
- Does "Assistant" also rename user-facing skill/MCP names that say "recall" (`minutes-mcp-recall`)?
- Should Memo appear in the same list by default, or be filtered out of "Meetings" unless "All" is chosen?
- Weekly summary: a suggested Assistant prompt (proposed) or a fixed view?
