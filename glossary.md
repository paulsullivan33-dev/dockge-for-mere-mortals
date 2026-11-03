# Glossary

**Agent** — another Dockge instance
whose stacks appear in your Dockge page;
your instance forwards your actions to
the host that owns the stacks (chapter
10).

**Compose file** — the `compose.yaml`
(older name `docker-compose.yml`) that
defines a stack's services, images,
ports, volumes and rules in YAML.

**Composerize** — Dockge's converter
from a `docker run …` command line to a
Compose service definition; also the
name of the library it uses (chapter 9).

**Container** — a running instance of
an image: the process, its filesystem
and its network, isolated by the Docker
daemon.

**Daemon** — the Docker service process
that actually creates and runs
containers, reached through its socket.
Dockge manages nothing without it.

**Data directory** — Dockge's own state
folder (`./data` by default): the
SQLite database of users and settings.
Kept separate from the stacks directory.

**Deploy** — in Dockge, save the stack
and run `docker compose up -d
--remove-orphans` in its folder.

**Docker socket** — `/var/run/docker.sock`,
the file that is the daemon's API
endpoint. Access to it is effectively
root access to the host.

**Down** — `docker compose down`: stop
a stack's containers and remove them
(and, by default, their network),
leaving the files.

**.env / global.env** — text files of
`KEY=value` lines handed to Compose for
variable interpolation: one per stack,
and one (`global.env`) shared by all
stacks in the stacks directory.

**Image** — the packaged filesystem and
instructions a container runs from,
named like `nginx:1.27-alpine` (name and
tag).

**JWT (token)** — the signed login token
the page presents after sign-in; Dockge
ties it to a fingerprint of your
password hash, so a password change
retires old tokens.

**Service** — one entry under
`services:` in a Compose file: one kind
of container, however many replicas,
with its ports and volumes.

**Socket.IO** — the live connection
between Dockge's page and its server;
every button press is a named event on
it, which is how this guide's lab driver
exercised the API.

**Stack** — one Compose project as
Dockge sees it: a named folder in the
stacks directory holding a
`compose.yaml`.

**Stacks directory** — the folder
Dockge manages (`DOCKGE_STACKS_DIR`,
default `/opt/stacks`), one subfolder
per stack.

**Terminal (web terminal)** — the
in-page terminal pane where the Compose
commands Dockge runs show their output
live, and where a stack's containers can
be attached to on a live install.

**Up** — `docker compose up`: create
and start a stack's containers from its
Compose file.
