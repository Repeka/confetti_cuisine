const express = require("express");
const path = require("path");
const layouts = require("express-ejs-layouts");

const homeController = require("./controllers/homeController");
const errorController = require("./controllers/errorController");
const messages = require("./messages");

// Lesson 14: connect to MongoDB with Mongoose (replaces the Lesson 13 native-driver block)
const mongoose = require("mongoose");
const Subscriber = require("./models/subscriber");

mongoose.connect("mongodb://localhost:27017/confetti_cuisine");
const db = mongoose.connection;

db.once("open", async () => {
  console.log("Successfully connected to MongoDB using Mongoose!");

  try {
    // Create and save a subscriber once (no duplicate on every restart)
    const existing = await Subscriber.findOne({ email: "jon@jonwexler.com" });
    if (!existing) {
      const subscriber1 = new Subscriber({
        name: "Jon Wexler",
        email: "jon@jonwexler.com"
      });
      console.log("Saved:", await subscriber1.save());
    }

    // Subscriber.create does new + save in one step
    const chef = await Subscriber.findOne({ email: "eggplant@confettiCuisine.com" });
    if (!chef) {
      console.log(
        "Created:",
        await Subscriber.create({
          name: "Chef Eggplant",
          email: "eggplant@confettiCuisine.com",
          zipCode: 20331
        })
      );
    }

    // Custom query: find one subscriber named Jon whose email contains "wexler"
    const wexler = await Subscriber.findOne({ name: "Jon Wexler" }).where("email", /wexler/).exec();
    if (wexler) console.log("Found:", wexler.name);
  } catch (error) {
    console.log(`Mongoose error: ${error.message}`);
  }
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

// Student "My messages" pages and the admin inbox
app.use(messages);

// Error handlers must stay LAST
app.use(errorController.pageNotFoundError);
app.use(errorController.internalServerError);

app.listen(app.get("port"), () => {
  console.log(`Server running at http://localhost:${app.get("port")}`);
});
