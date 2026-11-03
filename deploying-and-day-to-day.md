# Deploying and the Day to Day

**Outcome: for each everyday button you
can name the exact Compose command
Dockge runs, where its output goes, and
what its failure looks like — because
this lab pressed all of them on a
machine whose daemon does not exist.**

Dockge's stack verbs are thin, honest
wrappers. From the source, and confirmed
in the lab's server log, each one runs
the `docker` CLI in the stack's folder
and streams the run into the page's
terminal:

| Button | What Dockge runs |
|---|---|
| Deploy | saves the stack, then `docker compose up -d --remove-orphans` |
| Start | `docker compose up -d --remove-orphans` |
| Stop | `docker compose stop` |
| Restart | `docker compose restart` |
| Update | `docker compose pull`, then up again |
| Down | `docker compose down` |
| Delete | `docker compose down --remove-orphans`, then removes the folder |

If a `global.env` exists in the stacks
directory (chapter 10), those commands
gain `--env-file` arguments for it and
for the stack's own `.env` — otherwise
what you see is the table, literally;
the lab's log prints the argument lists,
for example `[ 'compose', 'down',
'--remove-orphans' ]`.

## The failure surface, verbatim

On a healthy install, pressing Deploy
shows images pulling and containers
starting in the terminal. The lab can
show you the other end of that pipe,
because every press met the same absent
daemon (transcript `t05`). The API
replies are deliberately plain:

```text
deployStack → "Failed to deploy, please check the terminal output for more information."
startStack  → "Failed to start, please check the terminal output for more information."
downStack   → "Failed to down, please check the terminal output for more information."
deleteStack → "Failed to delete, please check the terminal output for more information."
```

…and the terminal output they point at,
preserved in Dockge's own server log as
the CLI's stderr, is the one line this
whole guide hangs on:

```text
failed to connect to the docker API at unix:///var/run/docker.sock; check if the path is correct and if the daemon is running: dial unix /var/run/docker.sock: connect: no such file or directory
```

Two smaller behaviours are worth
knowing before you meet them live.
Asking for the network list without a
daemon fails with a bare
`Process exited with code 1`. Asking for
per-service status or container stats
does not fail at all — it returns empty
collections, `{}` in the lab's replies,
which on a real install is also what a
stack with nothing running can look
like. A *quiet* answer is not proof of a
healthy stack; the status field from
chapter 5 said `unknown` for the same
reason.

Delete deserves its warning in plain
words: it runs `down` **first**, and
only removes the folder after that
succeeds. In the lab it therefore
removed nothing — a small, accidental
safety property. On a live install the
same order means Delete is a real
two-step: containers stopped and
removed, then the folder — and the
`compose.yaml` in it — is gone. There
is no Dockge recycle bin; your own
backup of the stacks directory
(chapter 6) is the undo.

Everything in this chapter past the
failure surface — the look of a
successful deploy, live logs, a
container's interactive terminal — is
documented-only here, and `criteria.md`
says so. What is proven is the part a
troubleshooter actually needs first:
the commands, the plumbing, and the
exact words of the refusal.
