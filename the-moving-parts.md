# The Moving Parts

**Outcome: given any Dockge behaviour —
a login, a saved stack, a deploy that
failed — you can name which part did it
and where its evidence lives.**

Five parts do all the work.

**The server.** Dockge is one Node.js
program (the lab's was version **1.5.0**,
run from the project's source with
`npm start`). It serves the web page,
holds the API the page talks to, and
runs every action the page requests. One
process, one port — 5001 by default, and
the lab moved its copy to a loopback
port of its own by setting `DOCKGE_PORT`.

**The page.** A single-page web app.
Behind the login it has a small map of
screens: the dashboard and stack list,
the Compose editor at `/compose` (with a
per-stack address like
`/compose/bookmark-vault`), a terminal
screen, a host console at `/console`,
and settings at `/settings` with
general, appearance, security,
global-environment and about tabs. The
page and the server talk over a
Socket.IO connection — every button
press is a named event with a reply,
which is exactly what this guide's lab
driver used to exercise Dockge without
a browser (the transcripts are that
conversation, printed).

**The data folder.** Dockge's own state
— who the users are, their hashed
passwords, the signing secret for login
tokens, general settings — lives apart
from your stacks, in a **data directory**
(`./data` by default, `DOCKGE_DATA_DIR`
to move it). The lab watched it appear
on first start: a small SQLite database,
`dockge.db`, plus its config file. The
first start also writes the log lines
that tell the whole story: *Database
Type: sqlite*, *JWT secret is not found,
generate one*, and *No user, need setup*.
Delete the database and Dockge is a
newborn again — that is not a metaphor,
it is the recovery procedure the setup
error message itself names.

**The stacks directory.** The folder you
nominate with `DOCKGE_STACKS_DIR`
(default `/opt/stacks`). One subfolder
per stack, one `compose.yaml` per
subfolder. Dockge reads this directory
the way you would: by listing it. There
is no registry to corrupt and no export
to run — chapter 6 leans on this.

**The Docker CLI and the daemon.** For
anything that touches real containers,
Dockge shells out to the ordinary
`docker` command — `docker compose up -d
--remove-orphans` and its siblings — in
the stack's folder, streaming the output
into a **web terminal** (a real terminal
session, carried over the socket). The
daemon at the other end of
`/var/run/docker.sock` does the lifting.
This is the seam this guide's lab could
see daylight through: the CLI was
present (Docker 29.1.3, Compose v5.6.0),
the daemon and its socket were absent,
and every daemon-touching action failed
at that seam with the CLI's own words
preserved in Dockge's server log.

Around those five sit two smaller parts
worth naming: the **agents** (other
Dockge instances whose stacks can appear
in your page — chapter 10) and the
**composerize** converter, a small
library that turns a `docker run` line
into YAML without going near a daemon —
which is why it worked perfectly in a
lab where nothing else about containers
could (chapter 9).
