const courses = [
  { title: "Italian Pasta from Scratch", when: "Saturdays", cost: 50 },
  { title: "Knife Skills 101", when: "Sundays, 14:00", cost: 25 },
  { title: "Weeknight Stir-Fry", when: "Wednesdays, 18:30", cost: 30 }
];

module.exports = {
  showHome: (req, res) => {
    res.render("index");
  },

  showCourses: (req, res) => {
    res.render("courses", { offeredCourses: courses });
  },

  showMenu: (req, res) => {
    res.render("menu");
  },

  showSignUp: (req, res) => {
    res.render("contact");
  },

  postedSignUpForm: (req, res) => {
    res.render("thanks");
  }
};