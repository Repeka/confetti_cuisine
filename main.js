const express = require("express");
const path = require("path");
const layouts = require("express-ejs-layouts");

const homeController = require("./controllers/homeController");
const errorController = require("./controllers/errorController");
const messages = require("./messages");

const app = express();

app.set("port", process.env.PORT || 3000);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(layouts);
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Pages
app.get("/", homeController.showHome);
app.get("/courses", homeController.showCourses);
app.get("/menu", homeController.showMenu);
app.get("/contact", homeController.showSignUp);

// Contact form: save the message (messages.js), then show the thank-you page
app.post("/contact", messages.saveContactMessage, homeController.postedSignUpForm);

// Student "My messages" pages and the admin inbox
app.use(messages);

// Error handlers must stay LAST
app.use(errorController.pageNotFoundError);
app.use(errorController.internalServerError);

app.listen(app.get("port"), () => {
  console.log(`Server running at http://localhost:${app.get("port")}`);
});
