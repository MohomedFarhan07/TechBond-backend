const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const app = express();

app.use(express.json());

app.post("/signup", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.send("User added successfully");
  } catch (err) {
    res.status(400).send(err.message);
  }
});

app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;
  const user = await User.findOne({ emailId: userEmail });
  if (user.length === 0) return res.status(404).send("User not found");
  res.send(user);
});

app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  const user = await User.findByIdAndDelete(userId);

  res.send("User deleted successfully...");
});

app.patch("/user", async (req, res) => {
  const userId = req.body.userId;
  const data = req.body;
  const user = await User.findByIdAndUpdate(userId, data, {
    runValidators: true
  });
  res.send(user);
});

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});

    res.send(users);
  } catch (err) {
    res.status(404).send(err.message);
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
