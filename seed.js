// Run with: node seed.js
// Clears the subscribers collection and loads some sample subscribers.
const mongoose = require("mongoose"),
  Subscriber = require("./models/subscriber");

const contacts = [
  { name: "Jon Wexler", email: "jon@jonwexler.com", zipCode: 10016 },
  { name: "Chef Eggplant", email: "eggplant@confettiCuisine.com", zipCode: 20331 },
  { name: "Professor Souffle", email: "souffle@confettiCuisine.com", zipCode: 19103 }
];

mongoose.connect("mongodb://localhost:27017/confetti_cuisine");

Subscriber.deleteMany()
  .exec()
  .then(() => {
    console.log("Subscriber data is empty!");
    return Promise.all(contacts.map((c) => Subscriber.create(c)));
  })
  .then((results) => {
    console.log(JSON.stringify(results, null, 2));
  })
  .catch((error) => {
    console.log(`ERROR: ${error}`);
  })
  .then(() => mongoose.connection.close());