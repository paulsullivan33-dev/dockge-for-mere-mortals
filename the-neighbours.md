# The Neighbours

**Outcome: you can place Dockge against
the tools it is compared with, on the
one axis that matters — how much of
Docker each one tries to hold.**

All four tools in this chapter are
characterised, not run, except where a
series guide did the running elsewhere;
this lab exercised Dockge only.

**Portainer** is the broad console.
Stacks, yes — and also single
containers, images, volumes, networks,
registries, and user access control over
all of it, in a heavier interface with a
longer reach. This series' Portainer
guide ran a full install and stack
deploy in its own lab. If you think in
*containers*, Portainer is the natural
home. Dockge is the answer to a narrower
complaint — that for the Compose-only
work, the broad console was slow and
its deploy feedback unclear — and its
author came from exactly that
frustration. People genuinely run both:
Portainer for the estate, Dockge for
the stacks they edit daily.

**The plain Docker Compose CLI** is the
neighbour underneath everything. Dockge
adds a list, an editor, a login and a
streaming terminal *over* commands you
already have; it adds no capability the
CLI lacks, and takes nothing away —
every Dockge stack remains fully
CLI-operable, which is chapter 6's
point. If your stacks live on one
machine you already shell into, and you
edit happily in a terminal editor, the
CLI is not a lesser choice; Dockge is
for the moment the folders multiplied,
or the terminal stopped being the place
you wanted to live.

**Komodo** manages Compose stacks too,
but keeps its centre of gravity
elsewhere: stack definitions are synced
from Git repositories and held with more
machinery between you and the file.
Choose it when version-controlled,
reproducible deployment across servers
is the goal. Dockge's opposite bet — the
file on the disk *is* the definition,
edit it in the page or by hand — is the
reason its adopt-a-project recipe
(chapter 11) takes four steps.

And one relative deserves a sentence:
**Uptime Kuma**, Dockge's sibling by the
same author, is the monitoring half of
the family — it watches services and
says when they stop, but manages
nothing. The look and feel Dockge
borrows from it is deliberate; the two
are commonly run side by side, one to
tend the stacks and one to watch them.
