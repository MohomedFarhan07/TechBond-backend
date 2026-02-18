const express = require("express");
const connectDB = require("./config/database");
const app = express();

const User = require("./models/user");

app.post("/signup", async (req, res) => {
  const userObj = {
    firstName: "Virat",
    lastName: "Kohli",
    emailId: "virat@gmail.com",
    password: "Virat@123",
  };

  try {
    const user = new User(userObj);
    await user.save();
    res.send("User added successfully");
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

connectDB()
  .then(() => {
    console.log("Database connection is established...");
    app.listen(3000, () => {
      console.log("Successfully listening to the port 3000...");
    });
  })
  .catch((err) => {
    console.log("Database cannot be connected!!");
  });
