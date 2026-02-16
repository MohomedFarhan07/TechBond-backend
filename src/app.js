const express = require("express");
const app = express();

app.use("/home", (req, res) => {
  res.send("Hello world from the Home page...");
});

app.use("/test", (req, res) => {
  res.send("Hello world from the test page...");
});

app.use("/", (req, res) => {
  res.send("Hello world from the server...");
});

app.listen(3000, () => {
  console.log("Successfully listening to the port 3000...");
});
