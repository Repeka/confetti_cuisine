const mongoose = require("mongoose"),
  { Schema } = mongoose,
  userSchema = new Schema(
    {
      name: {
        first: {
          type: String,
          trim: true
        },
        last: {
          type: String,
          trim: true
        }
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
      // WARNING: plain text for this unit only (the book hashes passwords in Unit 5).
      // Never use a real password while testing.
      password: {
        type: String,
        required: true
      },
      // many-to-many: a user can be enrolled in many courses
      courses: [{ type: Schema.Types.ObjectId, ref: "Course" }],
      // one-to-one: a user can be linked to one subscriber account
      subscribedAccount: { type: Schema.Types.ObjectId, ref: "Subscriber" }
    },
    {
      // adds createdAt and updatedAt
      timestamps: true
    }
  );

// Virtual attribute: computed when read, never saved in the database.
// Normal function (not an arrow function) so "this" is the user.
userSchema.virtual("fullName").get(function () {
  return [this.name.first, this.name.last].filter(Boolean).join(" ");
});

module.exports = mongoose.model("User", userSchema);