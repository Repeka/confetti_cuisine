// Run with: node repl.js
// Tests the Lesson 17 models: validators, instance methods, associations and populate.
// WARNING: it clears the subscribers and courses collections first.
const mongoose = require("mongoose"),
  Subscriber = require("./models/subscriber"),
  Course = require("./models/course");

async function run() {
  await mongoose.connect("mongodb://localhost:27017/confetti_cuisine");

  // 1. Start from an empty database
  const removedSubs = await Subscriber.deleteMany({});
  const removedCourses = await Course.deleteMany({});
  console.log(`Removed ${removedSubs.deletedCount} subscribers and ${removedCourses.deletedCount} courses`);

  // 2. Create a subscriber and use the getInfo instance method
  await Subscriber.create({ name: "Jon", email: "Jon@JonWexler.com", zipCode: 12345 });
  const testSubscriber = await Subscriber.findOne({ name: "Jon" });
  console.log("getInfo:", testSubscriber.getInfo()); // email is saved in lowercase

  // 3. Validators: each of these should fail
  for (const bad of [
    { name: "Bad Zip", email: "zip@test.com", zipCode: 123 },
    { name: "Bad Zip 2", email: "zip2@test.com", zipCode: 890876 },
    { email: "noname@test.com" },
    { name: "Duplicate", email: "jon@jonwexler.com" }
  ]) {
    try {
      await Subscriber.create(bad);
      console.log("UNEXPECTED: saved", bad);
    } catch (error) {
      console.log("Rejected as expected:", error.message);
    }
  }

  // 4. Create a course and associate it with the subscriber
  const testCourse = await Course.create({
    title: "Tomato Land",
    description: "Locally farmed tomatoes only",
    zipCode: 12345,
    items: ["cherry", "heirloom"]
  });
  console.log("Created course:", testCourse.title);

  testSubscriber.courses.push(testCourse);
  await testSubscriber.save(); // save again so the association is stored

  // 5. Populate: replace the course ObjectIds with the full course documents
  const populated = await Subscriber.populate(testSubscriber, "courses");
  console.log("Populated subscriber:", JSON.stringify(populated, null, 2));

  // 6. Find every subscriber associated with that course
  const enrolled = await Subscriber.find({ courses: testCourse._id });
  console.log("Subscribers in Tomato Land:", enrolled.map((s) => s.name));

  // 7. findLocalSubscribers instance method (same zip code)
  const local = await testSubscriber.findLocalSubscribers();
  console.log("Local subscribers:", local.map((s) => s.name));
}

run()
  .catch((error) => console.log(`ERROR: ${error.message}`))
  .then(() => mongoose.connection.close());