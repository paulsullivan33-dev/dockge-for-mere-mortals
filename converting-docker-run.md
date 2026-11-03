# Converting a Docker Run Line

**Outcome: a long `docker run …` command
— the shape in which half the internet's
install instructions arrive — becomes a
Compose service you can save as a stack.**

Dockge's Compose screen has a companion
tool, in the page as a *convert* action
and in the API as the `composerize`
event: paste a `docker run` command, get
back a `compose.yaml` service. It is one
of the few Dockge features that never
goes near the Docker daemon — it is a
text transformation, done by a small
library the project bundles — so the lab
could exercise it for real while
everything container-shaped was out of
reach (transcript `t04`).

The input was a typical one-liner:

```bash
docker run -d --name hello-web -p 8081:80 -e TITLE=Hello nginx:1.27-alpine
```

and the reply, complete:

```yaml
services:
    nginx:
        container_name: hello-web
        ports:
            - 8081:80
        environment:
            - TITLE=Hello
        image: nginx:1.27-alpine
```

Read what it did, because that is the
whole feature: the service takes its
name from the **image** (`nginx`), the
`--name` becomes `container_name`, the
`-p` becomes a port pair, each `-e`
becomes an environment line, and the
detached `-d` simply evaporates — a
Compose service is started detached by
nature when Dockge deploys it. Volume
mounts (`-v`), restart flags and the
other common switches convert the same
way; the result lands in the editor,
where it is yours to rename (you will
usually want a better service name than
the image's), extend with a second
service, and save as a stack in the
ordinary way.

What it is not: a migration guarantee.
A `docker run` line can carry host
network modes, privileged flags, device
mappings and one-off shell constructions
that have no tidy Compose equivalent, or
an equivalent the converter does not
know. Treat the output as a very good
first draft written by a fast typist:
check it in the editor, then give it the
chapter 7 pre-flight — `docker compose
config` in the stack folder — before
you trust it with anything. The
conversion is also the honest way to
adopt a single container you already run:
convert, save, and the loose container
has become a stack, with a file, in the
directory where chapter 6 says files
are the whole point.
