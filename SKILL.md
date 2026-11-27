---
name: ai-video-batch
description: Plan short narrative videos for AI character or influencer accounts, present concise story summaries for human approval, then turn approved stories into shotlists and batch-generate videos using the account's reference assets. Use for Nadou or other connected generation platforms, with variable account and video counts. Does not publish or distribute content.
---

# AI video batch production

Make reviewable videos with minimal repeated model and browser work. Account identity, batch size, platform, model, format, duration and sound rules are inputs, never constants. Do not inherit another account's characters, voices or creative style.

## 0. Establish the account's creative profile

Before proposing stories for a new account, **always conduct an initial account-brief Q&A and wait for the user's answer**. Establish visual medium, story genre and target audience; do not infer an entire account from its character assets. Ask once in a compact bundle, not one field per turn. Prefill facts the user has already supplied and ask only what is missing. If everything is supplied, ask one concise confirmation of the assembled profile before ideation. This onboarding is separate from the later story-summary approval. Skip onboarding only for an already confirmed account profile.

**3D cartoon, photorealistic/live-action-looking, 2D and mixed-media describe appearance; couple comedy, suspense, horror, wholesome everyday life and satire describe genre.** Realistic scenery does not imply serious plots or real filmed footage. A hybrid can pair a stylized character with a realistic environment; specify both.

Use the smallest useful account profile: `visualMedium`, `storyGenre`, `targetAudience`, `tone`, `charactersAndDynamics`, `contentBoundaries`, `settingRules`, `soundRules`, `assetBindings`, and `generationSettings`. The initial brief covers five creative dimensions: appearance; genre/tone; audience age/language/market as relevant; characters and relationships; desired or excluded content. Treat 'broad audience' or 'no special exclusions' as valid user answers rather than demanding demographic detail. Also resolve missing assets and production settings before generation. Do not invent answers. Offer concise choices when helpful. Persist confirmed facts once; subsequent batches ask only about changed or genuinely missing facts, never repeat the full questionnaire.

Keep the approved profile revision with every task. Independent account workers receive that revision, never another account's default. Hold unsubmitted tasks when their profile materially changes, reconcile the changed prompts, and clarify only unresolved effects; do not regenerate completed videos automatically.

## 1. Plan, then wait for story approval

Reuse session facts and an existing account profile. Ask only about missing information that affects the result: account/characters, reference assets, count, creative direction, model/settings and retries. Inspect connected sources when they can supply missing facts. Do not ask again about confirmed settings.

Before drafting full shotlists or creating generation nodes, present all requested ideas in a compact table: `ID | Title | Setup → reversal → final payoff`. Usually one sentence per idea. Group large lists by account for scanning; do not silently reduce the requested count or require approval in fixed-size batches.

Match structure to the account: vary motives, settings and payoff mechanisms across a batch instead of repeating one joke with new props. A reversal is useful when the genre calls for it, not a requirement for every account. Where a history exists, consult only a compact recent list of titles/conflicts/endings to avoid repeats; do not load old full shotlists. Maintain this history from approved task metadata, not a new long report. If the user identifies winning or weak ideas, record that feedback in the account profile and apply it to later batches.

**Stop here until the user explicitly approves stories.** Record the approved IDs and the approved summary text. “Give me ideas” or silence is not approval. Revisions invalidate approval only for changed stories. Approval to proceed covers generation of the approved stories under the agreed settings; do not ask again before every ordinary submission. A changed account, asset, model, cost scope or materially different plot needs clarification.

## 2. Prepare approved stories

**Use the user's shotlist skill for every approved story; this is a required dependency, not an optional suggestion.** The established skill is `ai-cinematic-shotlist-director` (the user's cinematic shotlist skill). Resolve its current installed version and read its SKILL.md once per context before drafting; do not substitute an improvised short outline. If it is absent from the current catalog, search installed local/plugin skill locations for the named skill. Resolve its currently installed skill or plugin directory; do not assume a fixed machine path or cache version. If it cannot be found, stop shotlist/generation work and explain the missing dependency rather than silently replacing it. The user's explicitly selected replacement skill takes precedence.

Preserve that skill's required shot design, continuity, independent shot descriptions, reference fidelity, stable IDs and coverage checks. User format instructions override its defaults, including account-specific genre, sound, aspect ratio and duration. Draft full shotlists only for approved IDs. Reuse shared global direction and continuity as that skill permits; do not paste unrelated director reports into the platform prompt. Reduce token use through reusable account facts, compact operational output and deterministic submission, **not by omitting required shotlist work**. Do not assume the local skill is loaded into Nadou's own Agent; apply it in this agent and send the resulting generation instructions with the actual assets.

Build one compact task per complete video unless the user chooses per-shot production. Every shot is one continuous take; the complete-video prompt may sequence cuts between shots. Include clear framing, observable actions/reactions and necessary sound cues. Fit shot durations to the requested total; no fixed number of shots or videos. Show full shotlists only when requested; otherwise put them directly into the task queue.

Keep one account profile for reference identities, ordered voice bindings, visual continuity and parameters. Store each task's title, approved summary, prompt and state in UTF-8 JSON. Include the minimum identity/sound/continuity anchors needed in each independent request. **A shared local profile does not mean the generation model receives it:** required instructions must still reach every request. Reference assets must actually be attached, not merely named in prose. Where supported, use the platform's real named @asset tags to bind each character and each voice, not only positional prose such as image 1/audio 2. Actual tags must be inserted through the reference picker and verified as structured reference tokens; typing an @name string is not equivalent. Preserve them when copying/editing templates. Explicitly lock relative character height and body size independently of identity references. Do not expose multi-view labels or reference-sheet text in the output.

## 3. Submit efficiently

**All required assets must have real references.** Build `requiredReferences` for every character design, each speaker's voice, and any supplied scene, prop, image/video/audio reference used by the current video. This means all relevant assets, not unrelated items elsewhere on the canvas. In Nadou each item must appear as a real named @node tag and have the necessary attachment/connection. Never substitute image/audio numbers or plain-text @names. Explicitly map each character to its own image and voice. Shared identity/voice tags belong in the header; shot-specific tags belong beside the relevant actions. For another platform, use its native structured equivalent; if the binding cannot be represented, report the limitation instead of silently replacing it with prose.

Immediately before **each** Generate action, compare intended references with actual structured tags and attached/connected asset identities. Check every required item and its character/voice/scene/prop role. Resolve duplicate labels by asset node ID, not an arbitrary name match. Recheck after cloning or editing: whole-editor plain-text replacement can erase tags. Missing, stale, ambiguous or wrong-role bindings block submission until corrected. Use a small deterministic preflight, not a full canvas dump. Named references clarify identity but do not guarantee output quality or body scale.

Prefer an available official API or supported batch feature; otherwise use browser DOM/semantic automation. Use native desktop clicks only when those cannot perform the action. Do not spend time looking for an API when a working browser route is already established. For Nadou, read [references/nadou.md](references/nadou.md). Read only the selected platform adapter.

Configure and verify one account template once. Copy its settings and asset bindings to independent output nodes, replace the prompt, and submit each approved task once. Verify the new copy kept the required references and parameters using a small DOM read; do not reload the entire canvas for each task. Submit subsequent tasks while earlier videos generate. Queue according to observed platform limits; do not equate task count, tabs, agents and generation concurrency.

Use deterministic scripts for repeated UI steps. [scripts/orca-bridge.cjs](scripts/orca-bridge.cjs) provides safe argument passing, compact CLI output, file-based prompt filling and a submission ledger. It is a helper, not a replacement for reading the installed Orca browser instructions or discovering current page controls. Use it only when Orca is the selected browser. See [references/task-plan.md](references/task-plan.md) for its input shape.

Persist `prepared → submission-requested → generating → complete/failed/uncertain`. Record task/node association before submitting. On timeout or an ambiguous response, inspect that same task; never click Generate again on silence. No automatic retries unless explicitly authorized. Retry only the authorized failed IDs and limit.

## 4. Leave a clean human review area

Place each new node in its reserved review slot as it is created, away from old content and reference assets. Use readable account/ID/title labels and generous spacing based on actual node dimensions. Do not leave copies overlapping. Move only this batch's outputs. Preserve reference connections. Use normal supported layout, dragging or keyboard movement; do not edit hidden app state or CSS as a substitute for a saved layout.

After submission, poll only a small status read, normally at 30–60 second intervals, and report changes briefly. When complete, leave the viewport on the review area, pause outputs and close editing overlays. A changed view can hide connections for review without removing them.

**Default stopping condition:** all approved tasks are complete, failed or explicitly uncertain, with outputs named and separated on the platform. No local video downloads, frame extraction, playback review, ffprobe/spec inspection, editing, publishing, extra reports or workspace cleanup unless requested. Reading platform completion/error state is still necessary. Do not claim content quality, voice fidelity or measured output specs without inspecting them. Final reply: counts, review location, failed/uncertain IDs and retry truth; keep it short.

## Multiple accounts and agents

Use one coordinator for idea approval and account-to-task mapping. Prefer one coordinator plus scripted submissions for low token cost. Add content workers only when distinct accounts need independent creative work; give each only its account profile and assigned approved IDs, not the full conversation.

At most one UI writer per canvas/project. More tabs on the same canvas do not create independent workspaces. Separate concurrent accounts by canvas/project, page ID, output area and task ledger; keep assets, voices and settings isolated. Do not assume the same browser profile is a different logged-in service account. Do not sign up, switch accounts or distribute content unless requested.

Agent concurrency is limited by the actual environment; queue excess account jobs rather than promising arbitrary parallelism. Platform video jobs may run concurrently even with one agent. When the user explicitly requests supervised Orca workers, use the installed orchestration skill. A hypothetical question about ten agents does not authorize starting ten workers.
