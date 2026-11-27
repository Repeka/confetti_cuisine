const Subscriber = require("../models/subscriber");

module.exports = {
  // Step 1 of the index page: run the query and store the result on res.locals
  index: (req, res, next) => {
    Subscriber.find({})
      .then((subscribers) => {
        res.locals.subscribers = subscribers;
        next();
      })
      .catch((error) => {
        console.log(`Error fetching subscribers: ${error.message}`);
        next(error);
      });
  },

  // Step 2 of the index page: render the view (it can read res.locals.subscribers)
  indexView: (req, res) => {
    res.render("subscribers/index");
  },

  // GET /subscribe: show the newsletter signup form
  getSubscriptionPage: (req, res) => {
    res.render("subscribe");
  },

  // POST /subscribe: save the posted form data as a new Subscriber
  saveSubscriber: (req, res) => {
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
  }
};