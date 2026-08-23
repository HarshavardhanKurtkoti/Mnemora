---
trigger: always_on
---

# Project Continuity & Engineering Log

This is a persistent engineering project.

You MUST maintain project continuity across every agent interaction.

The repository contains three project-state files:

* `docs/decisions.md`
* `docs/steps.md`
* `docs/backlog.md`

These files are part of the project's source of truth and MUST be kept up to date.

---

## 1. ALWAYS READ PROJECT STATE FIRST

Before planning, modifying code, or making implementation decisions:

1. Read `docs/steps.md`.
2. Read `docs/decisions.md`.
3. Read `docs/backlog.md`.
4. Understand the current phase.
5. Understand what has already been completed.
6. Identify the current task.
7. Check whether there are existing decisions that constrain the proposed implementation.

Do NOT assume that the current prompt contains the complete project context.

The project state files exist specifically so work can continue across different conversations and sessions.

---

# 2. DECISIONS.md — ARCHITECTURAL MEMORY

File:

`docs/decisions.md`

Every meaningful technical, architectural, product, infrastructure, or design decision MUST be recorded here.

A decision should be recorded when:

* Multiple reasonable approaches exist.
* A technology/framework/library is selected.
* An architecture pattern is chosen.
* An important trade-off is accepted.
* An implementation deliberately deviates from an obvious alternative.
* A constraint influences the design.
* A previous decision is changed or reversed.

Do NOT record trivial implementation details.

Every decision should explain:

* What was decided.
* Why it was decided.
* Alternatives considered.
* Why the alternatives were rejected, when relevant.
* Important consequences or trade-offs.

Use this format:

```text
## Decision: <short title>

Date: YYYY-MM-DD
Status: Accepted | Superseded

### Decision

<What was decided>

### Reason

<Why this decision was made>

### Alternatives Considered

- <alternative>
- <alternative>

### Consequences

<Important implications or trade-offs>
```

If a new decision contradicts an existing decision:

1. Find the old decision.
2. Mark it as `Superseded`.
3. Record the new decision.
4. Explain why the decision changed.

Never silently overwrite architectural history.

---

# 3. STEPS.md — PROJECT STATE

File:

`docs/steps.md`

This file tracks the project's execution state.

After meaningful implementation work, update this file.

It MUST clearly communicate:

* Current phase.
* Current status.
* Completed work.
* Work currently in progress.
* Pending work.
* The current task.
* The next logical step.
* Important blockers, if any.

Use checkboxes where appropriate.

Example structure:

```text
# Project Progress

## Current Phase

<phase>

## Status

<IN PROGRESS | BLOCKED | COMPLETE>

## Completed

- [x] ...

## In Progress

- [ ] ...

## Pending

- [ ] ...

## Current Task

...

## Next Step

...

## Blockers

...
```

Do not mark work as completed unless it has actually been implemented and verified.

When a task is completed, update `steps.md` before moving to the next major task.

---

# 4. BACKLOG.md — DEFERRED WORK

File:

`docs/backlog.md`

Use this file for work that is intentionally deferred.

Examples:

* Future improvements.
* Experiments.
* Optimizations.
* Nice-to-have features.
* Technical debt.
* Ideas that are not part of the current scope.
* Improvements discovered during implementation.

Do NOT implement backlog items unless the user explicitly asks for them or the current task requires them.

When a backlog item becomes active:

1. Move or copy it into the appropriate active work section in `steps.md`.
2. Remove it from the backlog if it is no longer deferred.
3. Work on it only when it becomes part of the active scope.

---

# 5. BEFORE STARTING WORK

Before changing code:

1. Read the three project-state files.
2. Determine the current project phase.
3. Determine the current task.
4. Check relevant previous decisions.
5. Check whether the requested work already exists in the backlog.
6. Identify dependencies and constraints.
7. If the request introduces a meaningful architectural decision, record that decision in `decisions.md` before implementation.

Do not blindly start coding.

---

# 6. DURING IMPLEMENTATION

While implementing:

* Follow existing decisions.
* Do not silently change architecture.
* Do not introduce major dependencies without recording the decision.
* Do not duplicate functionality that already exists.
* Keep the implementation aligned with the current phase.
* Do not expand scope unnecessarily.

If implementation reveals a new meaningful decision, record it in `decisions.md`.

If implementation reveals future work that is not required for the current task, add it to `backlog.md` instead of implementing it.

---

# 7. AFTER IMPLEMENTATION

After meaningful work is completed:

1. Verify the implementation.
2. Update `steps.md`.
3. Record meaningful decisions in `decisions.md`.
4. Add discovered future work to `backlog.md`.
5. Ensure the project state accurately describes reality.

Never leave project-state documentation describing work that has not actually been completed.

---

# 8. SESSION CONTINUITY

At the end of a meaningful task, `steps.md` must make it possible for another developer or a future agent to understand:

* What was done.
* What remains.
* What is currently being worked on.
* Where implementation stopped.
* What should happen next.

The objective is that a completely new agent session can read the project-state files and continue the work without relying on the previous conversation.

---

# 9. DO NOT CREATE FAKE PROGRESS

Never:

* Mark unfinished work as complete.
* Claim tests passed when they were not run.
* Claim an implementation exists when it does not.
* Remove historical decisions merely to simplify the document.
* Hide failed approaches.
* Delete backlog items merely because they are inconvenient.

Accuracy of project state is more important than making the project appear complete.

---

# 10. SCOPE DISCIPLINE

The user's current request defines the active scope.

Do not automatically implement:

* Future ideas.
* Optional improvements.
* Backlog items.
* Refactors unrelated to the task.

If you discover something useful but unrelated to the current task, add it to `docs/backlog.md`.

---

# 11. SOURCE OF TRUTH

When there is a conflict:

1. Current user instruction
2. Existing project architecture and explicit decisions
3. `docs/decisions.md`
4. `docs/steps.md`
5. `docs/backlog.md`

If a current user instruction intentionally changes an existing decision, update the decision history rather than silently replacing it.

---

# 12. FINAL RESPONSE

At the end of a meaningful task, briefly report:

* What was implemented.
* What was updated in `steps.md`.
* What decisions were added/changed in `decisions.md`.
* What backlog items were added, if any.
* What remains to be done.

Keep the response concise; the repository files contain the detailed project history.
