# Recipes

**Outcome: four small jobs done the
Dockge way. Those the lab could run are
marked run; those that end at a daemon
are marked where they stop.**

## Adopt a Compose project you already have — run

You have a working project folder with a
`compose.yaml` in it, started by hand
until now. To bring it under Dockge:

1. Stop the project (`docker compose
   down` in its folder) — on a live
   install; the folder is what moves.
2. Move or copy the folder into the
   stacks directory, so the layout is
   `<stacks>/<name>/compose.yaml`. The
   name must satisfy chapter 7's rule —
   lowercase, digits, `_`, `-`.
3. In Dockge, use **Scan Stacks Folder**
   from the menu — or simply look: the
   lab's hand-made folder was readable
   the moment it existed (chapter 6,
   transcript `t07`).
4. Open the stack and confirm the YAML
   shown is the file you moved — compare
   a line you recognise.

## Draft a stack on a machine with no Docker — run

Dockge makes a surprisingly good
Compose *drafting desk* on a machine
where nothing can run:

1. Install it from source (chapter 3)
   and create the admin (chapter 4).
2. Write stacks in the editor; Save
   gives you the name rule, the YAML
   parse and the .env check (chapter 7).
3. Shell into each stack folder and run
   `docker compose config` for the full
   Compose-level render — no daemon
   needed (transcript `t06`).
4. Copy the stacks directory to the real
   host when ready. The folders are the
   deliverable; nothing else has to move
   (point Dockge on the target at the
   same directory and scan).

## Give a stack a shared value — partly run

Several stacks need the same domain or
registry: put `SHARED_DOMAIN=example.com`
in `<stacks>/global.env` (Settings →
globalEnv, or a text editor), and refer
to `${SHARED_DOMAIN}` in each
`compose.yaml`. Chapter 10 shows how
Dockge adds the file to Compose
commands; the lab proved the single
stack's version of interpolation with
`docker compose config` (chapter 7).

## Check a whole stacks folder in one pass — run

After edits, an audit that touches
nothing live:

```bash
for d in stacks/*/; do
  name=$(basename "$d")
  if (cd "$d" && docker compose config --quiet); then
    echo "OK   $name"
  else
    echo "FAIL $name"
  fi
done
```

Every folder either renders as a valid
Compose project or names itself. It is
the chapter 7 check, looped — and a
reasonable thing to run *before*
pressing Deploy on anything the folder
contains, on any install, live daemon
or not.
