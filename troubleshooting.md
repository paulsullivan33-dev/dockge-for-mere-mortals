# Troubleshooting

**Outcome: the failures this guide
actually met, each with the check that
names it. Most Dockge trouble is one of
four things: the daemon, the folder,
the file, or the first-run state.**

## "Failed to deploy, please check the terminal output"

Dockge's generic sentence for "the
Compose command exited non-zero". Do
what it says — the terminal, or the
same command by hand in the stack
folder:

```bash
cd /opt/stacks/<name>
docker compose up -d --remove-orphans
```

If the reply is this guide's refrain —

```text
failed to connect to the docker API at unix:///var/run/docker.sock; check if the path is correct and if the daemon is running
```

— the fault is under Dockge, not in it:
the daemon is stopped, or (in the
container install) the socket mount
`/var/run/docker.sock:/var/run/docker.sock`
is missing from Dockge's own Compose
file, or the path differs on your
distro. Fix the daemon or the mount;
Dockge needs nothing. Transcript `t05`
is this failure at the API, `t06` at
the CLI.

## Dockge itself will not start, from source

Native module build errors during
`npm ci` on a new Node major version
are this lab's own trap (`t01`):
Dockge's engines line wants Node
**≥ 22.14.0** and its container builds
on Node 22, while Node 24 broke the
terminal module's compile. Match Node
22 and the same commands succeed.

## The setup page will not go away / will not come back

Setup is offered exactly when the user
table is empty. If a fresh page keeps
routing to `/setup`, you are looking at
a fresh (or different) data directory —
check `DOCKGE_DATA_DIR` and the *Data
Dir* log line. If you need setup *again*
on a real install, Dockge's refusal
names the procedure: it has been
initialized, and re-running setup means
deleting the database (Dockge stopped,
and knowing users and settings go with
it). For a merely forgotten password,
prefer the project's `reset-password`
script in the source tree.

## A stack does not appear in the list

The list is a directory listing
(chapter 6), so check the directory:
is the folder inside the stacks
directory Dockge was actually started
with (the `DOCKGE_STACKS_DIR` value and
the log's startup lines)? Is the file
inside it named `compose.yaml`? Is the
folder name within the name rules? Then
use the page's **Scan Stacks Folder**.
A file edited while Dockge runs is not
a problem — Dockge reads from disk —
but a stack *folder created under a
different Dockge* (a second instance, an
agent's host) belongs to that instance's
list, not this one's.

## The stack saved, but the values are wrong

Check which env actually applied.
Dockge's Save validates the .env pane,
but in the lab's 1.5.0 run it wrote only
`compose.yaml` to the folder (`t04`) —
if a value must live in a stack `.env`
file, confirm the file exists in the
folder, and remember `global.env` in
the stacks directory joins every
Compose command (chapter 10). Then
render the truth:

```bash
docker compose config
```

The rendered output shows each service
with its values filled in — the
difference between what you wrote and
what Compose understood, on one screen.

## "Process exited with code 1" and other bare replies

Some Dockge answers are the CLI's exit
code wearing a coat — the network list
without a daemon is one (`t05`). When a
reply is that bare, run the equivalent
command in a terminal; Compose's own
stderr is longer, and it is the real
message Dockge was summarising.
