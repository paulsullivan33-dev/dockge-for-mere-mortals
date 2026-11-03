// Dockge lab driver: speaks to Dockge's Socket.IO API the way the
// browser does (main events directly, stack events via "agent").
// Usage: node dockge-client.mjs <phase>
import { io } from "./dockge/node_modules/socket.io-client/build/esm/index.js";

const URL = "http://127.0.0.1:18087";
const phase = process.argv[2] || "all";

const socket = io(URL, { transports: ["websocket", "polling"] });

function emit(event, ...args) {
    return new Promise((resolve) => {
        socket.emit(event, ...args, (res) => resolve(res));
    });
}
function agent(event, ...args) {
    return new Promise((resolve) => {
        socket.emit("agent", "", event, ...args, (res) => resolve(res));
    });
}
function show(label, res) {
    console.log(`--- ${label}`);
    console.log(JSON.stringify(res, null, 2));
}

// Capture anything the server pushes at us (setup notice, info, terminal data)
for (const ev of ["setup", "info", "stackList", "agentInfo", "terminalWrite", "terminalExit", "refresh"]) {
    socket.on(ev, (data) => {
        let s = typeof data === "string" ? data : JSON.stringify(data);
        if (s && s.length > 600) { s = s.slice(0, 600) + "…[truncated]"; }
        console.log(`[server push: ${ev}] ${s ?? ""}`);
    });
}
socket.onAny((event, ...args) => {
    if (String(event).startsWith("terminal")) {
        console.log(`[onAny ${event}] ${JSON.stringify(args).slice(0, 800)}`);
    }
});

await new Promise((resolve) => socket.on("connect", resolve));
console.log("connected, socket id:", socket.id);
await new Promise((r) => setTimeout(r, 1500)); // let server pushes arrive

const ADMIN = { username: "labadmin", password: "Stack-Lab-42" };

const validYAML = `services:
  web:
    image: nginx:1.27-alpine
    container_name: bookmark-vault-web
    ports:
      - "8080:80"
    environment:
      - VAULT_TITLE=\${VAULT_TITLE:-Bookmark Vault}
    restart: unless-stopped
  keeper:
    image: busybox:1.36
    command: ["sh", "-c", "while true; do echo vault-ok; sleep 60; done"]
    restart: unless-stopped
`;
const validENV = "VAULT_TITLE=Bookmark Vault\n";

if (phase === "setup" || phase === "all") {
    show("setup (create first admin)", await emit("setup", ADMIN.username, ADMIN.password));
    show("setup again (should refuse)", await emit("setup", "second", "Stack-Lab-42"));
    show("login (wrong password)", await emit("login", { username: ADMIN.username, password: "wrong-pass-1", token: "" }));
    const login = await emit("login", { username: ADMIN.username, password: ADMIN.password, token: "" });
    show("login (correct)", { ...login, token: login.token ? login.token.slice(0, 25) + "…" : login.token });
}

if (phase === "stacks" || phase === "all") {
    show("login", { ok: (await emit("login", { username: ADMIN.username, password: ADMIN.password, token: "" })).ok });
    show("requestStackList (empty)", await agent("requestStackList"));
    show("saveStack bookmark-vault (valid)", await agent("saveStack", "bookmark-vault", validYAML, validENV, true));
    show("getStack bookmark-vault", await agent("getStack", "bookmark-vault"));
    show("requestStackList (one stack)", await agent("requestStackList"));
    show("saveStack duplicate name", await agent("saveStack", "bookmark-vault", validYAML, validENV, true));
    show("saveStack bad name", await agent("saveStack", "Bad Name!", validYAML, validENV, true));
    show("saveStack broken YAML", await agent("saveStack", "broken-stack", "services:\n  web:\n   image: [unclosed\n", "", true));
    show("saveStack invalid .env", await agent("saveStack", "badenv-stack", validYAML, "JUST WORDS NO EQUALS", true));
    show("composerize a docker run line", await emit("composerize", "docker run -d --name hello-web -p 8081:80 -e TITLE=Hello nginx:1.27-alpine"));
}

if (phase === "deploy" || phase === "all") {
    show("login", { ok: (await emit("login", { username: ADMIN.username, password: ADMIN.password, token: "" })).ok });
    show("deployStack bookmark-vault (no daemon)", await agent("deployStack", "bookmark-vault", validYAML, validENV, false));
    show("startStack bookmark-vault (no daemon)", await agent("startStack", "bookmark-vault"));
    show("serviceStatusList (no daemon)", await agent("serviceStatusList", "bookmark-vault"));
    show("getDockerNetworkList (no daemon)", await agent("getDockerNetworkList"));
    show("dockerStats (no daemon)", await agent("dockerStats"));
    show("downStack (no daemon)", await agent("downStack", "bookmark-vault"));
    show("deleteStack (no daemon)", await agent("deleteStack", "bookmark-vault"));
}

socket.close();
console.log("driver done:", phase);
process.exit(0);
