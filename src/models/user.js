const mongoose = require("mongoose");
const { Schema } = mongoose;
const validator = require("validator");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 20,
    },
    lastName: {
      type: String,
      minLength: 4,
      maxLength: 20,
    },
    emailId: {
      type: String,
      lowercase: true,
      required: true,
      unique: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is not valid");
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Enter a strong password");
        }
      },
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      lowercase: true,
      validate(value) {
        if (!["male", "female", "other"].includes(value)) {
          throw new Error("Gender is not valid!!!");
        }
      },
    },
    photoUrl: {
      type: String,
      default: "https://template-vault.vercel.app/avatar4.png",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Enter a valid URL");
        }
      },
    },
    about: {
      type: String,
      default: "This is a default about of the user...",
      minLength: 4,
      maxLength: 100,
    },
    skills: {
      type: [String],
    },
  },
  { timestamps: true },
);

userSchema.index({ firstName: 1, lastName: 1 });

userSchema.methods.getJWT = async function () {
  const user = this;

  const token = jwt.sign({ _id: user._id }, "Fun@Fact*$5%$", {
    expiresIn: "7d",
  });

  return token;
};

userSchema.methods.validatePassword = async function (passwordInput) {
  const user = this;
  const hashPassword = user.password;

  const isPasswordValid = await bcrypt.compare(passwordInput, hashPassword);

  return isPasswordValid;
};

module.exports = mongoose.model("User", userSchema);
