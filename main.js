const express = require("express");
const path = require("path");
const layouts = require("express-ejs-layouts");

const homeController = require("./controllers/homeController");
const errorController = require("./controllers/errorController");

const subscribersController = require("./controllers/subscribersController");
const usersController = require("./controllers/usersController");
const coursesController = require("./controllers/coursesController");
const messages = require("./messages");

// Connect to MongoDB with Mongoose (Lesson 14). The Subscriber model is now
// used from subscribersController.js, so main.js no longer needs it.
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/confetti_cuisine");
const db = mongoose.connection;

db.once("open", () => {
  console.log("Successfully connected to MongoDB using Mongoose!");
});

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

app.get("/subscribers", subscribersController.index, subscribersController.indexView);
app.get("/subscribe", subscribersController.getSubscriptionPage);
app.post("/subscribe", subscribersController.saveSubscriber);

// Lesson 18: index pages that list every document of a model.
// (/courses is already the public course page, so the database list lives at /courses/list)
app.get("/users", usersController.index, usersController.indexView);
app.get("/courses/list", coursesController.index, coursesController.indexView);
// Student "My messages" pages and the admin inbox
app.use(messages);

// Error handlers must stay LAST
app.use(errorController.pageNotFoundError);
app.use(errorController.internalServerError);

app.listen(app.get("port"), () => {
  console.log(`Server running at http://localhost:${app.get("port")}`);
});
