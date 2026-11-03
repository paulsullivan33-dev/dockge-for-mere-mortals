# Setup and First Login

**Outcome: Dockge has exactly one admin
account, created by you, and you have
seen it refuse both a second setup and a
wrong password — the two refusals that
prove the gate is real.**

## The first visit

A fresh Dockge knows it has no users:
the server sets an internal *need setup*
flag, and the moment a browser (or this
guide's lab driver) connects, the server
pushes a `setup` notice down the socket
and the page routes to `/setup`. There
is one form: a username and a password
for the first administrator.

The password has a stated floor. From
the setup handler itself, a password the
strength checker calls too weak is
refused with:

```text
Password is too weak. It should contain alphabetic and numeric characters. It must be at least 6 characters in length.
```

The lab created its fixture admin —
username `labadmin`, a password of
letters, digits and dashes — and the
reply is the whole receipt:

```json
{ "ok": true, "msg": "successAdded" }
```

(transcript `t03`). The password is
stored hashed (Dockge uses a modern
password hash in its user table; the
database file is in the data folder from
chapter 2), and the server clears its
*need setup* flag.

## The gate, tested both ways

Setup is a one-time door. Asking again
on the same database gets:

```text
Dockge has been initialized. If you want to run setup again, please delete the database.
```

That sentence is also the recovery
story for a locked-out install whose
owner has host access: the database is
the state; removing it (with Dockge
stopped, and knowing it takes settings
and users with it) returns Dockge to
first-run. The project additionally
ships a `reset-password` script in its
source tree for the less drastic case.

Login is a socket event with the
username, password and a token field.
The wrong password:

```json
{ "ok": false, "msg": "authIncorrectCreds" }
```

The right one returns `ok: true` and a
signed **token** (a JWT — the payload
names the user, and the server checks a
fingerprint of the current password hash
against it, so changing the password
retires old tokens). The page stores
that token and can also log in *by*
token on later visits; the lab driver
did it the plain way each time. Logins
sit behind a rate limiter in the server,
and repeated failures are logged with
the connecting address.

## What this does and doesn't prove

Proven live, in `t03`: the setup push,
the account creation, the second-setup
refusal, the wrong-password refusal, and
a working login token. Described, not
exercised: two-factor authentication —
Dockge's login handler supports a token
step for accounts that enable it, and the
settings security tab is where a user
manages their password and second
factor. The lab left it off and says so.

One habit to start now: this account can
start any container (chapter 1). Its
password deserves the care you would
give a root password, because the Docker
socket makes the two nearly the same
thing.
