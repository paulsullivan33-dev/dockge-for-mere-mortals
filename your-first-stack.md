# Your First Stack

**Outcome: a new stack exists in
Dockge's list, and you can walk to the
exact folder and file it became on
disk — because the file is the stack.**

## The shape of the exercise

In the page, the route is: sign in,
choose **Compose** (the new-stack
screen, also at `/compose`), give the
stack a name, write or paste the
`compose.yaml` in the editor, and press
**Save** (in edit mode the same screen
also offers **Deploy** — chapter 8 is
about why those are different buttons).

The lab did the same thing through the
API the page uses, with a small invented
example — a "bookmark vault": a web
service on an ordinary web-server image,
plus a tiny helper that prints a
heartbeat. Nothing about it is real
infrastructure; it is a fixture with
two services, a port, an environment
variable with a default, and restart
rules, which is enough shape to be
honest practice:

```yaml
services:
  web:
    image: nginx:1.27-alpine
    container_name: bookmark-vault-web
    ports:
      - "8080:80"
    environment:
      - VAULT_TITLE=${VAULT_TITLE:-Bookmark Vault}
    restart: unless-stopped
  keeper:
    image: busybox:1.36
    command: ["sh", "-c", "while true; do echo vault-ok; sleep 60; done"]
    restart: unless-stopped
```

The Save call (event `saveStack`, with
the name, the YAML, the text of the
.env pane, and a flag saying *this is
new*) answered:

```json
{ "ok": true, "msg": "Saved" }
```

and reading the stack back
(`getStack`) returned the same YAML
whole, with Dockge's bookkeeping around
it: its name, `composeFileName:
compose.yaml`, `isManagedByDockge:
true`, and a status of 0 — Dockge's
*unknown*, the only honest status for a
stack whose containers no daemon has
ever reported on (transcript `t04`).

## The file is the receipt

Now the part to check with your own
eyes, in the stacks directory:

```text
stacks/
  bookmark-vault/
    compose.yaml        346 bytes
```

and the file's content is **byte for
byte the YAML that was sent** — the lab
diffed its fixture against the stored
file in everything but name. No header
added, no format imposed, no database
row standing in for it. Deleting the
stack from Dockge would run a Compose
command first (chapter 8); deleting the
*folder* is something you can do with
ordinary tools, after which the stack
simply stops being listed, because the
list is the directory.

Two naming facts the Save enforced,
both proven in the next chapter's
transcript: the stack name becomes the
folder name, so it is restricted to
lowercase letters, digits, `_` and `-`;
and saving a *new* stack under a name
that already exists is refused, while
saving over an existing stack is the
separate, deliberate edit-mode call.
