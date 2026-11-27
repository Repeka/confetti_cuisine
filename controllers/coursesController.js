const Course = require("../models/course");

module.exports = {
  // Step 1 of the index page: run the query and store the result on res.locals
  index: (req, res, next) => {
    Course.find({})
      .then((courses) => {
        res.locals.courses = courses;
        next();
      })
      .catch((error) => {
        console.log(`Error fetching courses: ${error.message}`);
        next(error);
      });
  },

  // Step 2 of the index page: render the view (it can read res.locals.courses)
  indexView: (req, res) => {
    res.render("courses/index");
  }
};