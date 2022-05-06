require("dotenv").config();
const express = require("express");
const errHandler = require("./middleware/errorHandler");
const app = express();
const path = require("path");
const cors = require("cors");

const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');
const PORT = process.env.PORT || 3500;

// Connect to DB Bellow

connectDB();

const logger = (req, res, next) => {
  console.log("Logged")
  next();
}

app.use(logger);


// cross origin resource sharing third-party middleware
app.use(cors());
// built in middleware
app.use(express.urlencoded({ extended: false }));

// middleware allowing use of JSON
app.use(express.json());

// middleware to serve static files
app.use(express.static(path.join(__dirname, "/public")));

// ----------------------------------------
// Routes bellow
app.use("/", require("./routes/root"));
app.use("/states", require("./routes/api/states"));


app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ error: "404 not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

app.use(errHandler);




mongoose.connection.once('open', () => {
  console.log("Connected to mongoDB");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

