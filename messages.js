// messages.js - student/admin messaging for Confetti Cuisine (Express, no extra packages)
const express = require("express");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const router = express.Router();
router.use(express.urlencoded({ extended: false }));

const FILE = path.join(__dirname, "data", "messages.json");

// Admin password: set ADMIN_PASSWORD in your environment, or one is generated each start.
const ADMIN_PASSWORD =
  process.env.ADMIN_PASSWORD || crypto.randomBytes(6).toString("hex");
if (!process.env.ADMIN_PASSWORD) {
  console.log("No ADMIN_PASSWORD set. Admin password for this run: " + ADMIN_PASSWORD);
}

// ---------- storage (one JSON file) ----------
function load() {
  try {
    return JSON.parse(fs.readFileSync(FILE, "utf8"));
  } catch {
    return { threads: [], messages: [] };
  }
}
function save(db) {
  fs.mkdirSync(path.dirname(FILE), { recursive: true });
  fs.writeFileSync(FILE, JSON.stringify(db, null, 2));
}

// ---------- helpers ----------
const TOKEN_RE = /^[a-f0-9]{32}$/;

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function getCookie(req, name) {
  const raw = req.headers.cookie || "";
  for (const part of raw.split(";")) {
    const [k, ...v] = part.trim().split("=");
    if (k === name) return v.join("=");
  }
  return null;
}

function page(title, body) {
  return `<!DOCTYPE html>
<html lang="en"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)} | Confetti Cuisine</title>
<link rel="stylesheet" href="/css/confetti_cuisine.css">
<style>
  .msg { margin: .6rem 0; padding: .6rem .9rem; border-radius: 8px; max-width: 36rem; }
  .msg.student { background: #eef3ff; }
  .msg.admin { background: #fff3e0; margin-left: 2rem; }
  .msg small { color: #666; display: block; }
  textarea { width: 100%; max-width: 36rem; }
  table { border-collapse: collapse; }
  td, th { padding: .4rem .8rem; border-bottom: 1px solid #ddd; text-align: left; }
</style>
</head><body>
<nav class="navbar">
  <a class="brand" href="/">Confetti Cuisine</a>
  <a href="/">Home</a>
  <a href="/courses">Courses</a>
  <a href="/menu">Menu</a>
  <a href="/contact">Contact</a>
  <a href="/my-messages">My messages</a>
</nav>
<main class="container">${body}</main>
</body></html>`;
}

function renderThread(db, thread, replyAction, viewer) {
  const msgs = db.messages
    .filter((m) => m.threadId === thread.id)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  const items = msgs
    .map(
      (m) => `<div class="msg ${m.sender}">
  <small>${m.sender === "admin" ? "Confetti Cuisine" : esc(thread.name)} &middot; ${esc(
        new Date(m.createdAt).toLocaleString()
      )}</small>${esc(m.body).replace(/\n/g, "<br>")}</div>`
    )
    .join("");
  return `${items || "<p>No messages yet.</p>"}
<form method="post" action="${replyAction}">
  <p><textarea name="message" rows="4" required placeholder="Write a ${
    viewer === "admin" ? "reply" : "message"
  }..."></textarea></p>
  <button type="submit">Send</button>
</form>`;
}

function requireAdmin(req, res, next) {
  const [scheme, encoded] = (req.headers.authorization || "").split(" ");
  if (scheme === "Basic" && encoded) {
    const pass = Buffer.from(encoded, "base64").toString().split(":").slice(1).join(":");
    const a = Buffer.from(pass);
    const b = Buffer.from(ADMIN_PASSWORD);
    if (a.length === b.length && crypto.timingSafeEqual(a, b)) return next();
  }
  res.set("WWW-Authenticate", 'Basic realm="Admin"').status(401).send("Admin login required");
}

function addMessage(db, threadId, sender, body) {
  db.messages.push({
    id: crypto.randomBytes(8).toString("hex"),
    threadId,
    sender, // "student" or "admin"
    body: body.trim().slice(0, 5000),
    createdAt: new Date().toISOString(),
    read: false,
  });
}

// ---------- student side ----------

// Saves a contact-form message (fields: name, email, message), then calls next().
// Used by POST /contact in main.js and by POST /messages below.
function saveContactMessage(req, res, next) {
  const { name, email, message } = req.body;
  if (!name || !email || !message || !message.trim()) {
    return res.status(400).send(page("Error", "<h1>Please fill in every field.</h1>"));
  }
  const db = load();
  let thread = null;
  const cookieToken = getCookie(req, "thread");
  if (cookieToken && TOKEN_RE.test(cookieToken)) {
    thread = db.threads.find((t) => t.id === cookieToken) || null;
  }
  if (!thread) {
    thread = {
      id: crypto.randomBytes(16).toString("hex"),
      name: name.trim().slice(0, 100),
      email: email.trim().slice(0, 200),
      createdAt: new Date().toISOString(),
    };
    db.threads.push(thread);
  }
  addMessage(db, thread.id, "student", message);
  save(db);
  res.set("Set-Cookie", `thread=${thread.id}; Path=/; HttpOnly; SameSite=Lax; Max-Age=31536000`);
  res.locals.threadId = thread.id;
  next();
}

router.post("/messages", saveContactMessage, (req, res) => {
  res.redirect("/my-messages/" + res.locals.threadId);
});

// "My messages" link in the nav: go to your thread if we remember you
router.get("/my-messages", (req, res) => {
  const token = getCookie(req, "thread");
  if (token && TOKEN_RE.test(token) && load().threads.some((t) => t.id === token)) {
    return res.redirect("/my-messages/" + token);
  }
  res.send(
    page(
      "My messages",
      `<h1>My messages</h1><p>You have no messages yet. <a href="/contact.html">Send us one</a>.</p>`
    )
  );
});

router.get("/my-messages/:token", (req, res) => {
  const db = load();
  const thread = TOKEN_RE.test(req.params.token) && db.threads.find((t) => t.id === req.params.token);
  if (!thread) return res.status(404).send(page("Not found", "<h1>Conversation not found</h1>"));
  let changed = false;
  db.messages.forEach((m) => {
    if (m.threadId === thread.id && m.sender === "admin" && !m.read) {
      m.read = true;
      changed = true;
    }
  });
  if (changed) save(db);
  res.send(
    page(
      "My messages",
      `<h1>My messages</h1>
<p>Bookmark this page to see our replies. Only people with this link can read it.</p>
${renderThread(db, thread, "/my-messages/" + thread.id, "student")}`
    )
  );
});

router.post("/my-messages/:token", (req, res) => {
  const db = load();
  const thread = TOKEN_RE.test(req.params.token) && db.threads.find((t) => t.id === req.params.token);
  if (!thread) return res.status(404).send(page("Not found", "<h1>Conversation not found</h1>"));
  if (req.body.message && req.body.message.trim()) {
    addMessage(db, thread.id, "student", req.body.message);
    save(db);
  }
  res.redirect("/my-messages/" + thread.id);
});

// ---------- admin side ----------

router.get("/admin/messages", requireAdmin, (req, res) => {
  const db = load();
  const rows = db.threads
    .map((t) => {
      const msgs = db.messages.filter((m) => m.threadId === t.id);
      const last = msgs.reduce((a, b) => (a && a.createdAt > b.createdAt ? a : b), null);
      const unread = msgs.filter((m) => m.sender === "student" && !m.read).length;
      return { t, last, unread };
    })
    .sort((a, b) => ((b.last && b.last.createdAt) || "").localeCompare((a.last && a.last.createdAt) || ""))
    .map(
      ({ t, last, unread }) => `<tr>
  <td><a href="/admin/messages/${t.id}">${esc(t.name)}</a></td>
  <td>${esc(t.email)}</td>
  <td>${esc(last ? last.body.slice(0, 60) : "")}</td>
  <td>${unread ? "<strong>" + unread + " new</strong>" : ""}</td>
</tr>`
    )
    .join("");
  res.send(
    page(
      "Admin inbox",
      `<h1>Inbox</h1>${
        rows
          ? `<table><tr><th>Student</th><th>Email</th><th>Latest</th><th>Unread</th></tr>${rows}</table>`
          : "<p>No messages yet.</p>"
      }`
    )
  );
});

router.get("/admin/messages/:token", requireAdmin, (req, res) => {
  const db = load();
  const thread = TOKEN_RE.test(req.params.token) && db.threads.find((t) => t.id === req.params.token);
  if (!thread) return res.status(404).send(page("Not found", "<h1>Conversation not found</h1>"));
  let changed = false;
  db.messages.forEach((m) => {
    if (m.threadId === thread.id && m.sender === "student" && !m.read) {
      m.read = true;
      changed = true;
    }
  });
  if (changed) save(db);
  res.send(
    page(
      "Conversation",
      `<h1>${esc(thread.name)}</h1><p>${esc(thread.email)}</p>
${renderThread(db, thread, "/admin/messages/" + thread.id, "admin")}
<p><a href="/admin/messages">&larr; Back to inbox</a></p>`
    )
  );
});

router.post("/admin/messages/:token", requireAdmin, (req, res) => {
  const db = load();
  const thread = TOKEN_RE.test(req.params.token) && db.threads.find((t) => t.id === req.params.token);
  if (!thread) return res.status(404).send(page("Not found", "<h1>Conversation not found</h1>"));
  if (req.body.message && req.body.message.trim()) {
    addMessage(db, thread.id, "admin", req.body.message);
    save(db);
  }
  res.redirect("/admin/messages/" + thread.id);
});

module.exports = router;
module.exports.saveContactMessage = saveContactMessage;
