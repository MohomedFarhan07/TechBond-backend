const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const app = express();
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");

app.use(express.json());

app.post("/signup", async (req, res) => {
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

app.post("/login", async (req, res) => {
  try {
    const { emailId , password } = req.body;

    const user = await User.findOne({ emailId: emailId });
    
    if (!user) {
      throw new Error("Invalid credentials!!!");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      res.send("User logged in succussfully...");
    } else {
      throw new Error("Invalid credentials!!!")
    }
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
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

app.patch("/user/:userId", async (req, res) => {
  const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "age", "skills"];

  const userId = req.params?.userId;
  const data = req.body;

  const isUpdateAllowed = Object.keys(data).every((k) =>
    ALLOWED_UPDATES.includes(k),
  );

  if (data?.skills.length > 10) {
    return res.status(400).send("Too many skills!!!");
  }

  if (!isUpdateAllowed) {
    return res.status(400).send("Update not allowed!!");
  }

  const user = await User.findByIdAndUpdate(userId, data, {
    returnDocument: "after",
    runValidators: true,
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
