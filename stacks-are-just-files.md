# Stacks Are Just Files

**Outcome: a stack that Dockge never
created — a folder and a file written by
hand — is read back by Dockge whole, and
you know exactly what "managed by
Dockge" does and does not mean.**

This is the chapter the whole tool
stands or falls on, so the lab tested
it in the unfriendly direction. Dockge
did not create this stack. A shell did:

```bash
mkdir -p stacks/hand-made-counter
cat > stacks/hand-made-counter/compose.yaml <<'EOF'
services:
  counter:
    image: busybox:1.36
    command: ["sh", "-c", "i=0; while true; do i=$$((i+1)); echo count=$$i; sleep 5; done"]
EOF
```

No Dockge call, no database entry, no
registration step — just a folder with
the right name in the right directory,
holding a file called `compose.yaml`.
Then, through the same API the page
uses, the lab asked Dockge for that
stack (`getStack hand-made-counter`,
transcript `t07`):

```json
{
  "ok": true,
  "stack": {
    "name": "hand-made-counter",
    "isManagedByDockge": true,
    "composeFileName": "compose.yaml",
    "composeYAML": "services:\n  counter:\n    image: busybox:1.36\n    command: …"
  }
}
```

The YAML came back whole and unchanged.
That is the entire discovery mechanism:
**Dockge's stack list is a directory
listing.** The page's own menu calls the
manual version of this *Scan Stacks
Folder*; Dockge's FAQ describes adopting
existing projects in exactly these terms
— stop the stack, move its
`compose.yaml` into
`<stacks>/<stackName>/compose.yaml`,
scan, and it appears.

`isManagedByDockge` turns out to be a
modest claim, and the source says what
it is: the stack's folder exists in the
stacks directory and is a directory. It
does not mean Dockge wrote the file,
tracks its history, or keeps a second
copy anywhere. The data folder from
chapter 2 holds users and settings; the
stacks hold themselves.

Three practical consequences follow,
and they are the reasons people choose
this tool:

- **Your exit is free.** Stop Dockge,
  delete it, and every stack remains a
  working Compose project in its folder,
  startable with `docker compose up -d`
  from a terminal.
- **Your other tools are welcome.**
  Edit the file in your own editor, put
  the stacks directory under version
  control, copy a folder to another
  machine — Dockge reads what is on
  disk, so nothing goes stale in a
  hidden store. (It can also go the
  other way: a hand edit is a real edit,
  and chapter 12 is plain about the
  database-free coin's other side.)
- **Backup is a copy.** The stacks
  directory plus Dockge's data folder is
  the whole estate; no export ritual.

Bear in mind the one naming wrinkle:
Dockge looks for `compose.yaml` (and
accepts the older `docker-compose.yml`
style names it checks for when a folder
is opened) inside a folder named for
the stack. A file floating loose in the
stacks directory is not a stack; the
folder is the unit.
