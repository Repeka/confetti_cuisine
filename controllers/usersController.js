const User = require("../models/user");

module.exports = {
  // Step 1 of the index page: run the query and store the result on res.locals
  index: (req, res, next) => {
    User.find({})
      .then((users) => {
        res.locals.users = users;
        next();
      })
      .catch((error) => {
        console.log(`Error fetching users: ${error.message}`);
        next(error);
      });
  },

  // Step 2 of the index page: render the view (it can read res.locals.users)
  indexView: (req, res) => {
    res.render("users/index");
  }
};