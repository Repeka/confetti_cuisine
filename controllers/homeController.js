const courses = [
  { title: "Italian Pasta from Scratch", when: "Saturdays", cost: 50 },
  { title: "Knife Skills 101", when: "Sundays, 14:00", cost: 25 },
  { title: "Weeknight Stir-Fry", when: "Wednesdays, 18:30", cost: 30 }
];

exports.showHome = (req, res) => {
  res.render("index");
};

exports.showCourses = (req, res) => {
  res.render("courses", { offeredCourses: courses });
};

exports.showMenu = (req, res) => {
  res.render("menu");
};

exports.showSignUp = (req, res) => {
  res.render("contact");
};

exports.postedSignUpForm = (req, res) => {
  res.render("thanks");
};
