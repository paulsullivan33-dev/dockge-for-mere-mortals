# Writing criteria for this guide

Every "for Mere Mortals" guide is written to the same nine-point
standard, so a reader who trusts one can trust the rest. Here it
is, with the verification notes for this particular guide below.

1. **Fix it first.** Reader outcomes lead, not action items: each
   chapter opens by naming the outcome it delivers, shows a check
   the reader can run to confirm they got it, and a reasonable
   reader finishes able to state what was done, what it means,
   and what to try next.
2. **Plain language.** Short sentences, everyday vocabulary,
   technical terms defined on first use. No slang, and no
   idioms that only make sense in one country — the reader may
   be translating as they go.
3. **No dead ends.** A guide never tells the reader to do
   something it cannot show them how to verify. Every claim a
   reader relies on — an install, a command, an output — is
   something this guide demonstrates or clearly labels
   documented-only below.
4. **Live-verified where it matters.** Procedures are run for
   real in the guide's lab wherever the build machine allows it,
   and the transcripts kept in the repository are the evidence.
   What could not be run is listed honestly below, never
   presented as if it had been.
5. **General audiences.** Nothing in this guide — examples,
   fixtures, names, addresses — is modelled on any particular
   reader or author's real life, network, or organisations.
   The lab's stacks are an invented bookmark vault and a
   counting loop.
6. **Standalone.** A reader needs this guide, its lab, and
   nothing else. Where another guide would genuinely help, it
   is pointed to once, by name, and the chapter still completes
   without it.
7. **Honest about limits.** Chapter 13 names what the tool
   cannot do: Compose stacks only and no single containers,
   nothing live without a Docker daemon, YAML-level (not
   Compose-level) validation on save, no history or undo for
   its plain files, security that ends at the Docker socket,
   no Windows support, and a small team's release pace.
8. **The ethics rule is in the text, early.** Dockge controls
   the Docker socket, and the socket is root in all but name —
   chapter 1 and the README state that line before any procedure
   depends on it: a Dockge admin is effectively a host admin, so
   Dockge belongs on trusted networks, off the public internet,
   with a password chosen accordingly. The stacks directory is
   other people's workloads in file form; the guide's recipes
   touch only fixtures the lab invented.
9. **Builds clean.** The site builds with MkDocs in strict mode
   with no warnings, and a fresh reader following the chapters
   in order reaches the stated outcome of each.

## Verification notes for this guide

The build machine is a 2-CPU, 7.7 GB Ubuntu 24.04 sandbox,
shared with other work while the lab ran. **The sandbox has
the Docker CLI and Compose plugin installed (Docker 29.1.3,
Compose v5.6.0) but no Docker daemon and no
`/var/run/docker.sock`, and no way to start one.** That single
fact shapes this guide: everything Dockge the program does was
run for real; everything the daemon does could not be, and is
listed as documented-only below. The lab did not soften this —
the exact daemon error is quoted from Dockge's own server log.

Dockge **1.5.0** (the current stable release; source cloned
from the project's GitHub repository, master at commit
`0329dab`, 2026-10-23) was installed from source in the lab:
`npm ci`, `npm run build:frontend`, `npm start`, run on
loopback port **18087** with its data and stacks directories
inside the lab's scratch. Because the sandbox's default Node
was 24 and Dockge's native terminal module failed to compile
under it, the lab used the official **Node 22.23.4** tarball
(Dockge's engines ask for Node ≥ 22.14.0 and its own container
builds on Node 22); under Node 22 the install and frontend
build completed cleanly. Dockge was driven through its real
Socket.IO API — the same events the browser sends — by the
lab's driver (`dockge-lab/dockge-client.mjs`), and every lab
server was stopped when the work ended; port 18087 is closed.

Run for real, with transcripts as evidence:

- Environment: OS, Node/npm versions, Docker CLI and Compose
  present, daemon socket absent, its exact `docker info`
  failure, the clone and the project's version and scripts
  (t00).
- Install: the Node 24 `npm ci` failure on the native
  node-pty module, then the clean Node 22 install and
  frontend build (t01).
- Startup: the full first-run log (*No user, need setup*,
  *Listening on 127.0.0.1:18087*), the SQLite data folder
  created, HTTP 200 and the Dockge page title, and the SPA
  routes for `/setup`, `/compose`, `/settings`, `/console`
  served (t02).
- Setup and login: the server's `setup` push, first-admin
  creation (`successAdded`), the second-setup refusal quoted
  verbatim, the wrong-password refusal, and a working login
  token (t03).
- Stacks: saving the invented two-service *bookmark-vault*
  stack, reading it back whole through the API, the stored
  `compose.yaml` on disk matching the sent YAML, the duplicate
  name refusal, the stack-name rule refusal, the YAML parser's
  verbatim error for a broken file, the invalid-.env refusal,
  and composerize converting a `docker run` line into a
  service definition (t04).
- The no-daemon failure surface: deploy, start, down and
  delete each returning Dockge's "Failed to …, please check
  the terminal output" replies; the network list failing with
  `Process exited with code 1`; status and stats returning
  empty rather than failing (t05).
- The CLI underneath: the argument lists and CLI stderr in
  Dockge's own server log, the same `docker compose up`
  command by hand failing with the absent-socket error, and
  `docker compose config` parsing and rendering the saved
  stack — including the interpolated environment default —
  with no daemon involved (t06).
- Adoption: a stack folder and `compose.yaml` written by hand
  on disk, never through Dockge, then read back whole by
  Dockge's `getStack` (t07).
- The audit loop of chapter 11 run over both lab stacks,
  each rendering OK under `docker compose config --quiet`
  (t08).

Observed and reported as such: in this 1.5.0 source install,
the `saveStack` call validated the lab's `.env` text but the
stack folder afterwards contained only `compose.yaml` — no
`.env` file was written. The guide reports this as a lab
observation in chapters 7 and 13 rather than a general claim
about every install route.

Documented only — described from the project's documentation
and source, not run, and the text does not claim otherwise:

- The normal container install (`docker compose up -d` of
  Dockge's own compose file) and updating it — both need the
  daemon the lab does not have. The lab ran the same 1.5.0
  server from source instead.
- Everything past the failure surface of chapter 8: a
  successful deploy, image pulls, containers starting,
  start/stop/restart/update against live containers, live
  container logs, and the per-container interactive terminal.
- The host console (read in configuration code as disabled
  unless `DOCKGE_ENABLE_CONSOLE=true`), the settings tabs'
  inner behaviour beyond their served routes, two-factor
  authentication setup, and the password-reset script.
- Multi-agent operation: pairing a second Dockge instance and
  managing its stacks (the lab ran one instance).
- The neighbour tools of chapter 12 (Portainer was run in its
  own guide's lab in this series; Komodo and the Compose CLI
  comparison is by documented design).

Fixtures are this guide's own and deliberately generic: an
invented *bookmark vault* web stack, a hand-made counting
loop, and a fixture admin account (`labadmin`) that existed
only inside the lab's throwaway database. No real service,
person or network appears anywhere in the lab.
