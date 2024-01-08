const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const { login, createUser } = require("./controllers/users");
const auth = require("./middlewares/auth");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

mongoose.connect("mongodb://localhost:27017/mestodb", {
  useNewUrlParser: true,
});

app.post("/signin", login);
app.post("/signup", createUser);

app.use("/cards", auth, require("./routes/cards"));
app.use("/users", auth, require("./routes/users"));

app.use("/", (req, res) => {
  res.status(404).send({ message: "Страница не найдена" });
});

app.listen(3000);
