# Limits

**Outcome: the honest edge of the tool,
in one place — what it refuses, what it
cannot know, and what its design costs
you.**

**Compose only, by design.** No
`compose.yaml`, no stack. Single
containers, networks, volumes and
images are not managed at all — the
project's own FAQ directs you elsewhere
for them and this guide found no hidden
exception. If half your Docker life is
loose containers, Dockge is at most
half your tool.

**Nothing live without a daemon.** Every
verb that touches a container is a CLI
call to a daemon that must be running
and reachable at the Docker socket.
Dockge cannot start anything for a
stopped daemon, diagnose much past the
CLI's own stderr (chapter 8 is that
stderr, verbatim), or tell you more
than the daemon tells it — status came
back `unknown` and stats came back
empty in this lab because there was no
one home to ask. Dockge's polish is a
presentation of Docker's answers, not a
second source of truth.

**Validation is YAML-deep.** Save
checks the name, the YAML syntax and
one .env shape (chapter 7). It does not
check Compose semantics, image
existence, port collisions with other
stacks, or anything on the host. The
failure for those arrives later, from
Compose, in the terminal.

**Plain files cut both ways.** No
database means no history, no undo and
no lock: two people (or a person and an
editor) can change the same
`compose.yaml`, and the last write wins
without a murmur. Delete removes the
folder for good once its `down`
succeeds. The stacks directory is an
ordinary folder, with an ordinary
folder's needs — your own version
control and backups supply what Dockge
doesn't.

**The socket is the security model.**
Dockge's reach is exactly the Docker
socket's reach, which is root's reach.
Its login, hashing and rate limiting
guard the front door of a building
whose walls are that socket mount; the
host console adds a web shell beside it
(off by default, and chapter 10 says
why to leave it so). Multi-host agents
extend the same trust across machines.

**Platform and pace.** The documented
install is a Linux container; Windows
is listed by the project as not yet
supported. And the release rhythm is a
small team's: the current stable line is
1.5.0, which is what this lab ran — new
features have historically arrived in
occasional, substantial steps (agents
in 1.4, the console change in 1.5)
rather than a weekly stream. For a tool
whose job is to stand still and hold
your files, that pace is mostly a
virtue, but it is worth knowing before
you build on it.
