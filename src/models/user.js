const mongoose = require("mongoose");
const validator = require("validator");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
var Validator = require("password-validator");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Email is invalid");
      }
    },
  },
  phone: {
    type: String,
    required: true,
    validate(value) {
      if (!validatePhone(value) && value[0] != '0') {
        throw new Error("Phone is invalid");
      }
    },
    // validate(value) {
    //   var phoneno = /^\+?([0-9]{2})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/;
    //   if (!validator.isMobilePhone(value)) {
    //     throw new Error("Phone is invalid");
    //   }
    // },
    // validate(value) {
    //   if (!validator.isMobilePhone(value)) {
    //     throw new Error("Phone is invalid");
    //   }
    // },
  },
  password: {
    type: String,
    required: true,
    validate(value) {
      // Not an alphanumeric
      if (!validatePassword(value)) {
        throw new Error("Password is invalid");
      }
    },
  },
  image: {
    type: Buffer,
  },
});
userSchema.virtual("news", {
  localField: "_id",
  foreignField: "user",
  ref: "News",
});
const validatePhone = function (value) {
  // Create a schema
  var schema = new Validator();
  // Add properties to it
  schema
    .is()
    .min(11) // Minimum length 11
    .is()
    .max(11) // Maximum length 11
    .has()
    .not()
    .uppercase() // Must not have uppercase letters
    .has()
    .not()
    .lowercase() // Must not have lowercase letters
    .has()
    .not()
    .digits() // Must not have digits
    .has()
    .not()
    .spaces(); // Should not have spaces
  return schema.validate(value);
};
const validatePassword = function (value) {
  // Create a schema
  var schema = new Validator();
  // Add properties to it
  schema
    .is()
    .min(8) // Minimum length 8
    .is()
    .max(100) // Maximum length 100
    .has()
    .uppercase() // Must have uppercase letters
    .has()
    .lowercase() // Must have lowercase letters
    .has()
    .digits(2) // Must have at least 2 digits
    .has()
    .not()
    .spaces() // Should not have spaces
    .is()
    .not()
    .oneOf(["Passw0rd", "Password123"]);
  return schema.validate(value);
};
userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await bcryptjs.hash(this.password, 8);
  }
});
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Please check email or password");
  }
  const isMatch = await bcryptjs.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Please check email or password");
  }
  return user;
};
userSchema.methods.generateToken = function () {
  const token = jwt.sign({ _id: this._id.toString() }, "newsAPI");
  return token;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
