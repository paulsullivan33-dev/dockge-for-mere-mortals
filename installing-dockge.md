# Installing Dockge

**Outcome: a Dockge server answering on
its port and announcing, in its own log,
that it needs its first user — by either
of the two real routes in.**

## The normal route: its own Compose stack

Dockge's documented install is a small
piece of self-reference — you start it
with the tool it manages. On a machine
with Docker 20 or newer (or Podman with
its Docker compatibility package):

```bash
mkdir -p /opt/stacks /opt/dockge
cd /opt/dockge
curl https://raw.githubusercontent.com/louislam/dockge/master/compose.yaml --output compose.yaml
docker compose up -d
```

That Compose file runs the published
image `louislam/dockge:1`, publishes
port **5001**, mounts the Docker socket,
gives Dockge a `./data` folder beside the
file, mounts `/opt/stacks` at the same
path inside, and sets
`DOCKGE_STACKS_DIR=/opt/stacks`. The two
paths-must-match warnings in that file
are real: Dockge passes folder paths to
Compose, so the stacks directory must be
the same path on the host and inside
Dockge's container. A generator on the
project's site will write the file with
a different port or stacks path if you
ask it. Updating later is the same
folder and `docker compose pull &&
docker compose up -d`.

This route is documented-only in this
guide: it needs a running daemon to
start the very container it describes,
and the lab had none. Nothing about it
is taken on faith, though — the lab ran
the same 1.5.0 server the image carries,
by the second route.

## The lab route: from source, with Node

Dockge is an ordinary Node program
underneath the container. The lab
cloned the project's repository
(`github.com/louislam/dockge`, master at
commit `0329dab`, package version
**1.5.0**) and followed its own scripts:

```bash
git clone https://github.com/louislam/dockge.git
cd dockge
npm ci
npm run build:frontend
DOCKGE_PORT=18087 DOCKGE_HOSTNAME=127.0.0.1 \
DOCKGE_DATA_DIR=/path/to/data/ \
DOCKGE_STACKS_DIR=/path/to/stacks \
npm start
```

Two honest details from that run.
First, **the Node version matters.**
Dockge's `package.json` asks for Node
**22.14.0 or newer**, and its own
container is built on `node:22`. The
sandbox's default Node 24 got as far as
compiling a native terminal module and
failed in a wall of C++ errors
(transcript `t01`); the official Node
**22.23.4** tarball installed everything
cleanly and built the frontend to
`frontend-dist/`. If you run from source,
match the major version the project
builds with — 22 — rather than the
newest Node you have. Second, `npm
start` runs the TypeScript backend
directly (through `tsx`); there is no
separate compile step for the server.

## The check

Whatever the route, the acceptance test
is the log and the page:

```text
INFO: Welcome to dockge!
INFO: Data Dir: /home/…/data/
INFO: Database Type: sqlite
INFO: Connected to the database
INFO: No user, need setup
INFO: Listening on 127.0.0.1:18087
```

and an HTTP 200 with the title `Dockge`
from the port you chose (transcript
`t02`). *No user, need setup* is the
healthy state of a fresh install — the
next chapter turns it into an account.
The environment variables the lab used
are the ones Dockge reads generally:
`DOCKGE_PORT`, `DOCKGE_HOSTNAME`,
`DOCKGE_DATA_DIR`, `DOCKGE_STACKS_DIR`,
and `DOCKGE_ENABLE_CONSOLE` (chapter 10
explains why that one ships off).
