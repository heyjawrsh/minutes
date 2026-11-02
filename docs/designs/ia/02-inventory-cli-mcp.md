# IA inventory: CLI, MCP, plugin skills

Source-derived (not from running `--help`). Snapshot of `upstream/main` @ afee87f3, 2026-11-01.
Paths: CLI = `crates/cli/src/main.rs`, MCP = `crates/mcp/src/index.ts`, skills = `.claude/plugins/minutes/skills/`.

## CLI

No help headings or display order: `minutes --help` lists ~61 commands in declaration order. Only alias: `copilot` → `coach`.

Visible commands in help order (hidden ones in brackets):

`recover-stem` · `record` · `mic-toggle` · `note` · `talk` (feature `voice-live`) · `stop` · `sensitive {start,stop}` · `extend` · [`process-queue`, `policy-audit`, `parakeet-helper`, `parakeet-benchmark`, `preflight-record`, `knowledge-status`, `agent-readiness`, `meetings-root`, `autoresearch`] · `apple-speech` · `semantic {setup,sync,search,status,clear}` · `capabilities` · `status` · `jobs` · `paths` · `storage` · `cleanup` · `search` · `actions` · `consistency` · `person` · `people {merge}` · `vocabulary {list,add,remove,suggest,rebuild}` · `commitments` · `research` · `list` · `export` · `ingest` · `clean` · `redo-speaker-mapping` · `resummarize` · `process` · `transcribe` · `template {list,show,validate}` · `watch` · `setup` · `qmd` · `automate` · `dictate` · `devices` · `sources` · `service` · `logs` · `health` · `demo` · `schema` · `get` · `events` · `copilot|coach {start,status,pause,resume,stop,feedback,eval,setup}` · `agent-annotate` · `insights` · `context {status,screen,activity-summary,search,get-moment}` · `import` · `vault {setup,status,unlink,sync}` · `voice {enroll,status,list,test,remove,delete-all}` · `enroll` (legacy) · `voices` (legacy) · `live` · `transcript` · `dashboard` · `delete` · `confirm`

Observations:
- First listed command is a niche recovery tool (`recover-stem`); maintainer tools (`apple-speech`, `capabilities`) are visible; core verbs (`get`, `delete`, `confirm`) are near the end.
- Positional "subcommands" in some places (`qmd status|cleanup`, `service install|…`, `automate weekly-summary|…`), real subcommands elsewhere.
- Deprecated no-op flags remain (`setup --parakeet`); `setup --demo` duplicates `demo --full`.

Overlapping clusters:
| Job | Commands |
|---|---|
| Capture (10) | `record` (+`--mode quick-thought`, `--intent memo\|room\|call`, `--call`), `live`, `dictate`, `talk`, `sensitive start`, `process`, `import <audio>`, `watch`, `transcribe`, `demo` |
| Find (10) | `search`, `semantic search`, `research`, `context search`, `insights`, `actions`, `commitments`, `consistency`, `person`, `people` |
| Re-run AI | `resummarize`, `redo-speaker-mapping`, `automate weekly-summary` |
| Voices/speakers (7) | `voice`, `enroll`, `voices`, `confirm`, `redo-speaker-mapping`, `people merge`, `vocabulary add --kind person` |
| Clean/delete (6) | `cleanup` (audio), `clean` (transcripts), `qmd cleanup`, `delete`, `demo --clean`, `semantic clear` |
| Status (13+) | `status`, `health`, `jobs`, `capabilities`, `paths`, `storage`, `logs`, + `status` subcommands of semantic/vault/voice/copilot/context/service, `transcript --status` |

## MCP server

34 tools (some capability-gated):
- Capture: `start_recording`, `stop_recording`, `add_note` (active recording only), `process_audio`, `start_dictation`, `stop_dictation`
- System: `get_status`, `list_processing_jobs`, `knowledge_status` (not read-only despite name)
- Retrieval: `list_meetings`, `search_meetings`, `get_meeting`, `research_topic`, `get_meeting_insights`, `track_commitments`, `consistency_report`
- People: `get_person_profile`, `relationship_map`, `list_voices`, `confirm_speaker` (compat stub)
- Desktop context (gated): `activity_summary`, `search_context`, `get_moment`, `get_screen_context`
- Live/Coach: `start_live_transcript`, `read_live_transcript` (no stop tool; says "use minutes stop"), `start_copilot`, `stop_copilot`, `copilot_status`, `read_copilot_nudges`
- Knowledge/management: `ingest_meeting`, `resummarize_meeting`
- Annotations: `add_agent_annotation`, `get_agent_annotations` (always unavailable)
- Documents/drafts: **none**

Resources: `ui://minutes/dashboard`, `minutes://meetings/recent`, `minutes://status`, `minutes://actions/open`, `minutes://events/recent`, `minutes://events/agent-annotations` (withheld), `minutes://events/live` + `{?since_seq,limit}` (unavailable), `minutes://live/copilot`, `minutes://meetings/{slug}`, `minutes://ideas/recent` (resource name kebab-case: `recent-ideas`).

Prompts: none registered in server; six exist only in `manifest.json` (`meeting_prep`, `weekly_review`, `find_action_items`, `person_briefing`, `topic_research`, `start_meeting`), overlapping skills.

Naming: mostly verb_noun, with noun_noun outliers (`copilot_status`, `knowledge_status`, `consistency_report`, `relationship_map`, `activity_summary`); mixed read verbs (`get_/read_/list_/search_/track_/research_`); unscoped `get_status`; incomplete start/stop pairs; mixed URI roots (`events/live` vs `live/copilot`).

## Plugin skills (25; `plugin.json` says 24)

- Capture: `record`, `note`, `video-review`
- Find: `search`, `list`, `ideas`, `mcp-recall`, `graph`
- Synthesis: `recap`, `weekly`, `brief`, `prep` (overlaps brief), `debrief`, `lint`, `mirror`
- Management: `tag` (no CLI/MCP equivalent), `ingest`, `cleanup` (promises archiving, runs raw-audio cleanup)
- Live: `copilot` ("Minutes Coach"), `live-sidekick`
- Setup: `setup`, `verify` (runs a script, not `minutes health`)
- Integrations: `x1-closeout`, `x1-send-meeting`
- Maintainer-only but shipped: `release-notes`

Names mix verbs (record, search, tag, lint) and nouns (ideas, graph, weekly, copilot).

## Cross-interface vocabulary

| Concept | CLI | MCP | Skills | Desktop |
|---|---|---|---|---|
| Recording / meeting | `record`, `stop` | `start_recording`, `*_meetings` | record, list, search | "Start Recording", mode "Meeting" |
| Short capture | `--mode quick-thought`, `--intent memo` | mode `quick-thought`, `ideas/recent` | `ideas` | "Memo", "Quick Thought" |
| Note | `note` (past meetings too) | `add_note` (active only) | `note` | "Add Note" |
| Document / draft / artifact | — | — | — | "Documents", "Create Draft", `cmd_create_artifact_*` |
| Assistant / agent | `talk`, `agent-readiness` | `add_agent_annotation` | `mcp-recall`, `live-sidekick` | "Recall", "Discuss with Agent", "Assistant" |
| Coach | `copilot` (alias `coach`) | `*_copilot` | `copilot` ("Coach") | "Coach" |
| Live transcript | `live`, `transcript` | `*_live_transcript` | `live-sidekick` | mode "Live" |
| Voices / people | `voice`, `enroll`, `voices`, `confirm`, `person`, `people` | `list_voices`, `confirm_speaker`, `get_person_profile`, `relationship_map` | `graph` | "Speaker diarization" |
| Processing | `jobs` | `list_processing_jobs` | — | "Jobs", "Processing" |
| Dictation | `dictate` | `start_dictation` | — | "Dictation" |
| Knowledge base | `ingest`, `knowledge-status` | `ingest_meeting`, `knowledge_status` | `ingest` | — |

## Top problems in these interfaces

1. ~10 capture entry points with no map; mode/intent/content-type vocabulary overlaps.
2. ~10 find commands, ungrouped.
3. Three overlapping voice surfaces (`voice`, `enroll`, `voices`).
4. Coach vs copilot split at every layer.
5. Documents/drafts exist only on desktop, under three names.
6. Flat unordered CLI help buries core commands.
7. Inconsistent MCP verbs, missing `stop_live_transcript`, advertised stubs.
8. Skill descriptions drift from what they run; capability gaps (`tag`); prompts only in the manifest.
