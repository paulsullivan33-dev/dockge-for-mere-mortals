# What Dockge Is

**Outcome: you can say what Dockge
manages (Compose stacks), what it
refuses to manage (everything else),
and where its power comes from (the
Docker socket) — before touching it.**

A **stack**, in Dockge's vocabulary, is
one Docker Compose project: a folder
containing a `compose.yaml` file that
describes one or more services — say, a
small web server and a helper that keeps
it company. Starting the stack means
`docker compose up` in that folder;
stopping it, editing it, and deleting it
are likewise things you could do with a
text editor and a terminal, one folder
at a time.

**Dockge is those folders, gathered
into a web page.** It keeps a list of
the stacks in one directory you choose,
gives each one an editor page with the
YAML on the left and a live terminal on
the right, and puts the everyday verbs
on buttons: deploy, save, start, stop,
restart, update, down, delete. Output
from the Compose commands streams into
the page as it happens, so the long wait
and the unclear spinner its author
disliked in other tools are replaced by
the command's own words. It also
converts pasted `docker run …` commands
into Compose YAML, and since version
1.4 it can show stacks from several
Docker hosts — *agents* — in the one
interface.

Two design decisions define it. The
first is that **the files stay plain**.
Dockge stores no stack definitions in
its database; a stack *is* its folder.
Rename the tool away and nothing is
stranded — chapter 6 proves this by
having Dockge read a stack folder that
was written by hand, without Dockge
anywhere near it. The second is what
Dockge *won't* do: it manages Compose
stacks and only Compose stacks. A single
loose container with no `compose.yaml`,
a Docker network, a volume browser —
the project's own FAQ sends you to
Portainer or the Docker CLI for those,
cheerfully and by design.

## Where the power comes from

Dockge does not contain a container
engine. When you press Deploy, Dockge
runs the ordinary `docker compose`
command in the stack's folder (chapter 8
shows the exact command lines, caught in
the lab's server log), and the Docker
daemon does the work — through the
**Docker socket**, the file
`/var/run/docker.sock` that is the
daemon's front door. Dockge's normal
install mounts that socket into Dockge's
own container, which is what lets a web
page start and stop your services.

That socket is root in all but name:
anyone who can ask it questions can
start a container with the host's whole
disk mounted inside. So the honest
summary of Dockge's security model is
short. The login screen is real (chapter
4), passwords are hashed, and sessions
are tokens — but a Dockge admin account
is effectively a host admin account.
Keep Dockge on networks you trust, do
not publish its port to the internet,
and choose its password accordingly.
Chapter 12 lists what else follows from
the design; nothing later in this guide
asks you to forget this paragraph.

## What it is not

Not a Docker teacher: it assumes a
`compose.yaml` is a thing you already
recognise (the Docker Compose guide in
this series teaches that from zero).
Not a monitoring tool: it shows stack
status and live output, not metrics
history or alerts — its author's other
project, Uptime Kuma, lives in that
house. And not a hosted service: Dockge
runs on your machine, phones nowhere,
and works on a network with no internet
at all once installed.
