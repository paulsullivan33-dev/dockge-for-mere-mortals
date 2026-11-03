# Agents and Settings

**Outcome: you know what the settings
screens hold, what an agent is, and the
two switches with security weight — the
host console and the global environment
file. Everything here that needed more
than one Docker host is documented-only
in this guide, and this chapter says
which parts those are.**

## Settings, as served

The lab confirmed the settings area
exists where the router says it does —
`/settings` with tabs for **general**,
**appearance**, **security**,
**globalEnv** and **about** (the page
shell for each is served like every
other route; transcript `t02` checks
the route, and the tab list is the
frontend's own). In outline:

- **General** holds server-level
  preferences and the primary hostname
  other features refer to.
- **Appearance** is per-user dressing:
  theme and language.
- **Security** is where your account's
  password is changed and two-factor
  authentication is managed (chapter 4
  notes the login handler supports the
  token step; the lab did not enable it).
- **About** shows the version — the
  server also pushes it to a signed-in
  page as `info`, and the lab's driver
  recorded it plainly: `"version":
  "1.5.0"`.
- **globalEnv** edits the stacks-wide
  environment file, which deserves its
  own paragraph.

## The global .env

A file named `global.env` in the
**stacks directory** (not inside any one
stack) is shared ground: when Dockge
builds a Compose command for any stack,
an existing `global.env` is added as an
`--env-file`, along with the stack's
own `.env` when it has one (the code
path is quoted in chapter 8). Values
every stack needs — a shared domain, a
registry address — belong there once,
instead of pasted into a dozen stacks.
It is a plain file too, editable from
the settings tab or by hand, and it
follows the same rule as everything in
that directory: what is on the disk is
what is true. Shared secrets in it are,
of course, shared — one leak reads
every stack.

## The host console, shipped off

The `/console` screen is a terminal
into the **host itself**, not into a
stack — a shell with the powers of the
user Dockge runs as, which in the
normal container install is uncomfortably
close to the host's root. In current
Dockge it is **disabled by default**:
the server only enables it when started
with `DOCKGE_ENABLE_CONSOLE=true` (the
lab read that in the server's own
configuration code; version 1.5.0 made
off-by-default the shipped behaviour).
Treat enabling it as what it is — adding
a web shell to a machine — and not as a
convenience toggle.

## Agents: many hosts, one page

Since 1.4, a Dockge instance can present
the stacks of *other* Dockge instances
alongside its own. Each remote instance
is an **agent**, registered in the
managing instance (the server keeps an
agent table in its database, and routes
your clicks to the owning host — the
API shape shows it: stack events carry
an endpoint, and a proxy forwards them).
One page, several machines' worth of
stack folders, each still living as
plain files on its own host.

The lab ran one instance on one machine,
so agents are **documented-only** here:
described from the project's release
notes and source, never paired or
exercised. If you adopt them, the
security paragraph from chapter 1
compounds — the managing instance is
now a skeleton key for every host it
reaches, and it deserves a network
position that admits it.
