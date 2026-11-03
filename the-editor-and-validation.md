# The Editor and Validation

**Outcome: you know the three checks a
Save actually performs — each quoted
from a real refusal — and the larger
check it does not perform, plus the one
command that performs it.**

The Compose screen is an editor with
two panes that matter here: the YAML
itself and a small `.env` pane for the
stack's environment text, over a live
terminal. When you press Save or Deploy,
Dockge runs a small `validate()` before
anything touches disk. The lab triggered
every one of its refusals on purpose
(transcript `t04`).

**The name rule.** A stack name becomes
a folder name, so it must match
lowercase letters, digits, `_` and `-`.
Asking for `Bad Name!` returns:

```text
Stack name can only contain [a-z][0-9] _ - only
```

**The YAML parse.** The YAML is run
through a real YAML parser, and a
failure returns the parser's own words,
with position — for a bracket left open
on line 4:

```text
Flow sequence in block collection must be sufficiently indented and end with a ] at line 4, column 1:

   image: [unclosed

^
```

That is genuinely useful editing
feedback: the file is not written, and
the message tells you where to look.

**The .env shape.** The env text gets
one narrow check: a single line with no
`=` in it is refused as
`Invalid .env format` — a guard against
a Windows error the code comments name.
Multi-line text and ordinary `KEY=value`
lines pass this check without their
contents being understood.

Then the checks stop — and here the
guide must be precise, because it is
easy to over-believe a Save button.
Dockge's validation does **not** check
that your YAML is a valid *Compose
file*: an unknown key, a misspelt
`services`, a port written in the wrong
shape — all sail through, because
parsing YAML is not the same as
understanding Compose. The tool that
does understand it is Compose itself,
and there is one command that asks it
without needing a daemon at all:

```bash
cd stacks/bookmark-vault
docker compose config
```

The lab ran exactly that on the saved
stack (`t06`): Compose parsed the file,
filled in the network, resolved the
ports — and quietly proved the
environment interpolation worked, since
the rendered output shows
`VAULT_TITLE: Bookmark Vault`, the
default from the YAML itself. A clean
`config` render is the strongest
pre-flight check a stack can get on a
machine with no daemon, and making a
habit of it (in Dockge's own terminal,
on a live install) is this chapter's
practical advice.

One lab observation belongs here
because Save is where it surfaced. In
this version (1.5.0), after the
`saveStack` call the stack folder held
exactly one file, `compose.yaml` — the
.env pane's text was validated by the
call, but no `.env` file appeared beside
it. Dockge *reads* a `.env` file when
one exists in the folder (and passes it
to Compose at run time), so for values
that must live in a file, write the file
— the hand-made route of chapter 6 —
rather than assuming the pane persisted
it. The observation is the lab's, from
its own transcripts, and chapter 13
repeats it as a trap to check for.
