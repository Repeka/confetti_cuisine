const express = require("express");
const path = require("path");
const app = express();
const port = 3001;

const messages = require("./messages");

app.use(express.static(path.join(__dirname, "public")));  // css, images, js
app.use(express.static(path.join(__dirname, "views")));   // /courses.html, /menu.html, /contact.html, ...
app.use(messages);                                        // student + admin messages

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

// 404 page, must stay LAST, after everything above
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "views", "error.html"));
});

app.listen(port, () => {
  console.log("Express server is listening on port number: " + port);
});