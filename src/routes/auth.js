const express = require("express");
const authRouter = express.Router();
const { validateSignUpData } = require("../utils/validation");
const bcrypt = require("bcrypt");
const User = require("../models/user");

authRouter.post("/signup", async (req, res) => {
  try {
    // validate the data
    validateSignUpData(req);

    const { password, firstName, lastName, emailId } = req.body;

    // Encrypt the password
    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });
    await user.save();

    res.send("User added successfully");
  } catch (err) {
    res.status(400).send(err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId: emailId });

    if (!user) {
      throw new Error("Invalid credentials!!!");
    }
    const isPasswordValid = await user.validatePassword(password);

    if (isPasswordValid) {
      // Create a JWT Token
      const token = await user.getJWT();

      // Add the token to cookie and send the response back to the server...
      res.cookie("token", token);
      res.send(user);
    } else {
      throw new Error("Invalid credentials!!!");
    }
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

authRouter.post("/logout", (req, res) => {
  try {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
    });

    res.status(200).send("Logged out successfully!");
    
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

module.exports = authRouter;
