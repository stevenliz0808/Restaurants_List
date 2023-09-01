const express = require("express");
const app = express();

const db = require("./models")
const Restaurant = db.Restaurant

const { engine } = require("express-handlebars");

const port = 3000;

app.engine("hbs", engine({ extname: "hbs" }));
app.set("view engine", "hbs");
app.set("views", "./views");

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.redirect("/restaurants");
});

app.get("/restaurants", (req, res) => {
  // const keyword = req.query.keyword;
  return Restaurant.findAll()
    .then((restaurants) => res.send({restaurants}))
    .catch((err) => res.status(422).json(err))
});

app.get("/restaurants/:id", (req, res) => {
  const id = req.params.id;
  const restaurant = restaurants.find(
    (restaurant) => restaurant.id.toString() === id
  );
  res.render("show", { restaurant });
});

app.get("/restaurants/new", (req, res) => {
  res.send(`create new one`);
});

app.post("/restaurants", (req, res) => {
  res.send("create successfully");
});

app.get("/restaurants/:id/edit", (req, res) => {
  const id = req.params.id;
  res.send(`edit ${id}`);
});

app.put("/restaurants/:id", (req, res) => {
  const id = req.params.id;
  res.send(`update ${id}`);
});

app.delete("/restaurants/:id", (req, res) => {
  const id = req.params.id;
  res.send(`delete ${id}`);
});

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
