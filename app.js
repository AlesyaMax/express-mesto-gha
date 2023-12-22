const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/mestodb", {
  useNewUrlParser: true,
});

app.use((req, res, next) => {
  req.user = {
    _id: "6581c567f82072c13ec00d34",
  };

  next();
});

app.use("/cards", require("./routes/cards"));
app.use("/users", require("./routes/users"));

app.listen(3000);
