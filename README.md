# Dockge for Mere Mortals

A Docker Compose stack is one YAML file
that describes a small family of
containers: which images, which ports,
which folders, what restarts when. The
file is plain and portable. The daily
work around it — editing the file in the
right folder, running `docker compose up`,
watching the output scroll — is spread
across a terminal and a directory tree.

**Dockge** gathers that work into one web
page. It is a self-hosted manager for
Compose stacks, written by Louis Lam, the
author of Uptime Kuma, and it shows. You
get a list of your stacks, an editor for
each stack's `compose.yaml`, buttons for
deploy, start, stop, restart and delete,
a live terminal where the Compose output
appears, and a tool that converts a
`docker run …` line into Compose YAML.
Through all of it, one promise matters
most: **Dockge does not kidnap your
files.** Every stack stays on disk as an
ordinary folder holding an ordinary
`compose.yaml`, exactly where you told
Dockge to keep them, usable with the
plain `docker compose` commands if Dockge
vanished tomorrow.

This guide explains how Dockge fits
together, how to install it, how the
first-admin setup and login work, and how
stacks are created, validated and stored.
Then it does something this series always
tries to do: it **shows its evidence**.
The lab behind this guide ran the real
thing — **Dockge 1.5.0**, built from the
project's own source — on a machine with
the Docker command-line tools installed
but **no Docker daemon at all**. That
sounds like a defect in the lab. It
turned into the guide's clearest lesson:
everything Dockge itself does (serve the
page, create the admin, check your YAML,
write the stack folder, convert a
`docker run` line) worked live and is
proven here, and everything the *daemon*
does failed at one exact, quotable line —
`failed to connect to the docker API at
unix:///var/run/docker.sock`. Drawing that
boundary precisely is worth more than a
demo where everything happens to work.

What the lab could not do, it did not
fake. Deploying a stack, starting and
stopping real containers, reading their
logs and opening their terminals need a
running Docker daemon, and the sandbox
has none — so those parts are taught from
the project's documentation and from the
exact commands Dockge was caught issuing,
and are labelled documented-only wherever
they appear. `criteria.md` keeps the full
ledger.

One line belongs up front, because
Dockge's power is borrowed power: Dockge
talks to Docker through the Docker
socket, and whoever controls that socket
can start any container with any folder
mounted — which is to say, they control
the host. A Dockge login is therefore a
serious credential. Run Dockge on your
own machines, keep it off the public
internet, and treat its admin password
like a root password, because in effect
it is one. Chapter 1 returns to this.

## What this guide covers

- [**What Dockge is**](what-dockge-is.md) —
  the mental model: one web page over your
  stack folders, Compose files left alone,
  and the socket that makes it powerful
- [**The moving parts**](the-moving-parts.md) —
  the Node server, the SQLite data folder,
  the stacks directory, the web terminal,
  and the Docker CLI doing the heavy work
- [**Installing Dockge**](installing-dockge.md) —
  the official container route, and the
  from-source route this lab ran, including
  the Node version it actually needs
- [**Setup and first login**](setup-and-first-login.md) —
  the first-admin flow, the password rule,
  the refused second setup, and the token
  that keeps you signed in
- [**Your first stack**](your-first-stack.md) —
  creating a stack in the editor and
  finding its folder and file on disk,
  byte for byte what you typed
- [**Stacks are just files**](stacks-are-just-files.md) —
  the proof chapter: a stack folder written
  by hand, with no Dockge involved, and
  Dockge reading it straight back
- [**The editor and validation**](the-editor-and-validation.md) —
  what Save actually checks: the name rule,
  the YAML parser's own words, the .env
  check, and what it does not check
- [**Deploying and the day to day**](deploying-and-day-to-day.md) —
  deploy, start, stop, down and delete as
  the Compose commands they really are,
  and their failure surface without a daemon
- [**Converting a docker run line**](converting-docker-run.md) —
  the composerize tool: one long command
  line in, a service definition out
- [**Agents and settings**](agents-and-settings.md) —
  several Docker hosts in one page, the
  settings screens, the global .env, and
  the host console that ships switched off
- [**Recipes**](recipes.md) — adopt an
  existing Compose project, draft a stack
  safely on a machine with no daemon,
  check a whole stacks folder in one pass
- [**The neighbours**](the-neighbours.md) —
  Portainer the broader console, the plain
  Compose CLI, and Komodo: what each does
  that Dockge doesn't, and vice versa
- [**Limits**](limits.md) — Compose only,
  nothing live without a daemon, YAML-level
  validation, and the rest stated plainly
- [**Troubleshooting**](troubleshooting.md) —
  "Failed to deploy", the socket line, the
  setup that will not repeat, the stack
  that does not appear, and the traps this
  guide's lab fell into
- [**Glossary**](glossary.md) — the terms,
  collected in one place

## What it doesn't cover

Running the Docker daemon itself — how
containers work, what an image is, how
Compose files are written — belongs to
the Docker and Docker Compose guides in
this series; this one starts where a
Compose file already makes sense to you.
Kubernetes and Swarm are out on purpose:
Dockge manages Compose stacks, nothing
else, and says so itself. Rootless Docker
and Podman are named where Dockge's
documentation names them, but the lab ran
neither.

## How to use this guide

Read chapter 1 for the model and chapter
2 for the map of parts. Chapter 3
installs; chapter 4 creates the admin
account in the same sitting. Chapter 6 is
the one to read slowly: the claim that
your files stay yours is the reason the
tool exists, and its proof — a stack
Dockge never created, read back whole —
is the check you can repeat on your own
setup. The lab's transcripts live in
`dockge-lab/transcripts/`; the driver
that spoke to Dockge's API the way a
browser does is `dockge-lab/dockge-client.mjs`
and the stack it saved is
`dockge-lab/bookmark-vault-compose.yaml`.

---

## Part of the series

This guide is one of the [For Mere Mortals](https://paulsullivan33-dev.github.io/mere-mortals/) guides: plain-language guides to the tools programmers and makers use.

Related guides:

- [Docker for Mere Mortals](https://paulsullivan33-dev.github.io/docker-for-mere-mortals/)
- [Docker Compose for Mere Mortals](https://paulsullivan33-dev.github.io/docker-compose-for-mere-mortals/)
- [Portainer for Mere Mortals](https://paulsullivan33-dev.github.io/portainer-for-mere-mortals/)
- [Watchtower for Mere Mortals](https://paulsullivan33-dev.github.io/watchtower-for-mere-mortals/)

## License

The writing in this guide is licensed under [CC BY 4.0](https://github.com/paulsullivan33-dev/dockge-for-mere-mortals/blob/main/LICENSE). Code examples and lab scripts are licensed under the [MIT License](https://github.com/paulsullivan33-dev/dockge-for-mere-mortals/blob/main/LICENSE-CODE).
