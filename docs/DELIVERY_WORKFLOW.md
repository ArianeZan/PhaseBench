# Delivery Workflow

This guide defines how PhaseBench tasks move from `master` to a short-lived branch and back using the terminal.

## Principles

- `master` must remain runnable and ready for the next task.
- Each backlog subtask uses one short-lived branch.
- Each merged task should appear as one business-readable commit on `master` whenever practical.
- Rebase updates a task branch; it does not merge the task into `master`.
- Fast-forward merge integrates a rebased task without creating a merge commit.
- Never commit directly to `master` for planned product work.

## 1. Start from the latest master

```bash
git switch master
git pull --ff-only origin master
git switch -c codex/<task-id>-<business-outcome>
```

Example:

```bash
git switch -c codex/pb-001b-project-commands
```

The branch name must describe the outcome in language understandable to product and business stakeholders. Technical implementation details belong in the task body.

## 2. Implement and verify the task

Keep the branch limited to the selected task. Before closing it:

1. Run every relevant automated check.
2. Verify the task's acceptance criteria.
3. Review and update affected documentation.
4. Review applicable `AGENTS.md` files and update them only when a durable rule has emerged.
5. Inspect the final diff for unrelated changes or secrets.

## 3. Commit and publish the branch

Use a Conventional Commit subject that communicates the result. Include the task ID when one exists.

```bash
git add <task-files>
git commit -m "feat: describe the business outcome (PB-000A)"
git push -u origin <branch-name>
```

Prefer one final commit per small task. Temporary local commits may be consolidated before integration.

## 4. Update the task branch before integration

If `master` changed while the task was in progress, replay the task on top of the latest remote state:

```bash
git fetch origin
git rebase origin/master
```

Resolve conflicts on the task branch, continue the rebase, and rerun relevant checks. Because rebasing changes commit hashes, update an already published task branch with:

```bash
git push --force-with-lease
```

Use `--force-with-lease`, never `--force`. Do not rebase a branch another person is actively using without coordinating with them.

## 5. Integrate the task from the terminal

After the task is approved and verified:

```bash
git switch master
git pull --ff-only origin master
git merge --ff-only <branch-name>
git push origin master
```

`--ff-only` deliberately stops if the branch is not based on the current `master`. In that case, return to the task branch, rebase it onto `origin/master`, rerun checks, and try again.

If the task branch contains multiple commits that should become one, consolidate them on the task branch before this step. Do not hide unrelated changes inside a squash.

## 6. Confirm and clean up

Confirm that local and remote `master` point to the expected commit:

```bash
git status --short --branch
git log -1 --oneline --decorate
git ls-remote --heads origin master
```

Only after confirming the integration, remove the completed branch:

```bash
git branch -d <branch-name>
git push origin --delete <branch-name>
```

Branch deletion is cleanup, not part of the merge. Keep the branch temporarily when it is still useful for review or rollback.

## When GitHub pull requests are useful

The same branch policy works with pull requests. Use a pull request when review, automated status checks, discussion, or an audit trail is valuable. Prefer **Squash and merge** for a small task with multiple work-in-progress commits, or **Rebase and merge** when its commits are already clean and meaningful.

Whether integration happens in GitHub or the terminal, the resulting `master` history should remain linear, focused, and understandable.

## Recovery rules

- If `git pull --ff-only` fails, inspect the divergence instead of using a plain `git pull`.
- If a rebase conflict is unclear, abort safely with `git rebase --abort` and reassess.
- Never use `git reset --hard`, force-push `master`, or rewrite shared history as part of this workflow.
- Never place access tokens in commands, remote URLs, documentation, or repository files.
