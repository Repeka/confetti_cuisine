const Subscriber = require("../models/subscriber");

// GET /subscribers: list every subscriber (query returns a promise with exec)
exports.getAllSubscribers = (req, res, next) => {
  Subscriber.find({})
    .exec()
    .then((subscribers) => {
      res.render("subscribers", { subscribers: subscribers });
    })
    .catch((error) => {
      console.log(error.message);
      next(error);
    })
    .then(() => {
      console.log("promise complete");
    });
};

// GET /subscribe: show the newsletter signup form
exports.getSubscriptionPage = (req, res) => {
  res.render("subscribe");
};

// POST /subscribe: save the posted form data as a new Subscriber
exports.saveSubscriber = (req, res) => {
  const newSubscriber = new Subscriber({
    name: req.body.name,
    email: req.body.email,
    zipCode: req.body.zipCode
  });

  newSubscriber
    .save()
    .then(() => {
      res.render("subscribed", { name: newSubscriber.name });
    })
    .catch((error) => {
      // plain text so posted values are never interpreted as HTML
      res.status(400).type("text").send(error.message);
    });
};