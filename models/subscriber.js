const mongoose = require("mongoose");

const subscriberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true
  },
  zipCode: {
    type: Number,
    min: [10000, "Zip code too short"],
    max: 99999
  },
  // many-to-many: a subscriber can be interested in many courses
  courses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }]
});

// Instance method: one-line summary of a subscriber.
// Use a normal function (not an arrow function) so "this" is the subscriber.
subscriberSchema.methods.getInfo = function () {
  return `Name: ${this.name} Email: ${this.email} Zip Code: ${this.zipCode}`;
};

// Instance method: find subscribers with the same zip code
subscriberSchema.methods.findLocalSubscribers = function () {
  return this.model("Subscriber")
    .find({ zipCode: this.zipCode })
    .exec();
};

module.exports = mongoose.model("Subscriber", subscriberSchema);