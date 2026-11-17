const express = require("express");
const path = require("path");
const layouts = require("express-ejs-layouts");

const homeController = require("./controllers/homeController");
const errorController = require("./controllers/errorController");
const messages = require("./messages");

// Lesson 13: connect to MongoDB with the native driver (temporary; Mongoose replaces this in Lesson 14)
const { MongoClient } = require("mongodb"),
  dbURL = "mongodb://localhost:27017",
  dbName = "confetti_cuisine";

(async () => {
  const client = new MongoClient(dbURL);
  try {
    await client.connect();
    const db = client.db(dbName);

    // Add a contact once (upsert by email so restarts don't create duplicates)
    await db.collection("contacts").updateOne(
      { email: "fred@queen.com" },
      { $setOnInsert: { name: "Freddie Mercury", email: "fred@queen.com" } },
      { upsert: true }
    );

    // Read all contacts and log them
    const data = await db.collection("contacts").find().toArray();
    console.log(data);
  } catch (error) {
    console.log(`MongoDB error: ${error.message}`);
  } finally {
    await client.close();
  }
})();

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
