# Task plan and bridge

Create per-account plans after the user approves summaries. Keep them small, local and in UTF-8. Do not store cookies or credentials. The plan is operational state, not an extra user-facing report.

```json
{
  "pageId": "selected-from-tab-list",
  "url": "exact-current-project-url",
  "orcaExecutable": "orca.exe",
  "accountId": "user-chosen-account",
  "profileRevision": "confirmed-account-profile-revision",
  "requiresNativeMentions": true,
  "requiredReferences": [
    { "nodeId": "character-asset-node-id", "label": "Exact character reference label", "type": "image", "role": "main character design" },
    { "nodeId": "voice-asset-node-id", "label": "Exact voice reference label", "type": "audio", "role": "main character Nya voice" }
  ],
  "approvedIds": ["story-01"],
  "tasks": [
    {
      "id": "story-01",
      "title": "Approved story title",
      "summary": "Setup → reversal → ending",
      "approvedSummary": "Setup → reversal → ending",
      "prompt": "Complete independently usable video prompt with shotlist",
      "nodeId": "new-output-node-id"
    }
  ]
}
```

Keep a separate confirmed account profile, or include it in the plan: visual medium, story genre, target audience, tone, character dynamics, content boundaries, setting rules, sound rules, asset IDs/order and generation settings. Complete the first-account Q&A before creating ideas. Visual medium and genre are different fields. Reference the confirmed profile by `profileRevision` so account workers use the same creative direction. Model, ratio, resolution, duration and review slots must be applied and verified by the platform adapter; the bridge does not silently apply them. A new account must not inherit another account's defaults.

Resolve `orcaExecutable` from the installed Orca skill, then use a bare executable or absolute executable path, not a shell command containing arguments. `approvedIds` and `approvedSummary` are written only after user approval. Changed summaries must be reapproved. Record `nodeId` as soon as its UI copy is created, before submission.

For Nadou set `requiresNativeMentions: true`. List **all required assets**, including each character image and voice plus any scene/prop/video/audio reference the task uses. The two entries above only illustrate the shape, not a fixed asset count. Task-specific `requiredReferences` may override the account list. Before submitting, the adapter must verify every real @tag, corresponding node identity/connection and character/voice role; a missing or wrong reference blocks generation. Preserve the structured header when filling story text, or reinsert tags via the picker after a whole-editor fill.

From the skill directory:

```text
node scripts/orca-bridge.cjs plan.json fill-task story-01 @e123
node scripts/orca-bridge.cjs plan.json submit-task story-01 @e130
node scripts/orca-bridge.cjs plan.json call snapshot --interactive --compact
```

Refs in these commands are freshly observed controls, not fixed examples. On PowerShell quote them as `'@e123'`. `call` is for other documented Orca page commands during discovery/setup/status/layout; it is not a route to bypass story approval or repeat a Generate action. Load platform/Orca instructions before using it. Raw `eval` remains subject to browser rules; do not use hidden app state.

`fill-task` reads the stored prompt rather than embedding it into shell code. `submit-task` writes a local ledger entry before clicking and refuses another submission for the same task. A receipt marks the request sent, not the video finished. Update the ledger from observed platform state. An ambiguous submission remains uncertain and cannot be automatically resent; investigate its existing node.

The bridge prints short effect summaries, not full page dumps or prompt text. Snapshot calls print a compact subset of relevant controls by default. Use a normal narrowly scoped snapshot if omitted context is needed. No video files are downloaded.
