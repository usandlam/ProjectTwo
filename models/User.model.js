const { Schema, model } = require("mongoose");

const bcryptjs = require('bcryptjs');
const saltRounds = 10;

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,
      lowercase: true,
      required: [true, 'Username is required.'],
      unique: true
    },
    passwordHash: {
      type: String,
      required: [true, 'Password is required.']
    }
  },
  {
    timestamps: true
  }
);

userSchema.methods.validatePassword = function (candidatePassword) {
  return new Promise((resolve, reject) => {
    bcryptjs.compare(candidatePassword, this.passwordHash, function (err, isMatch) {
      if (err) return reject(err);
      resolve(isMatch);
    });
  });
};

const User = model("User", userSchema);

module.exports = User;
