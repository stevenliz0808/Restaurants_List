const express = require("express");
const app = express();

const db = require("./models");
const Restaurant = db.Restaurant;
const { Op } = require("sequelize");

const { engine } = require("express-handlebars");
const methodOverride = require("method-override")

const port = 3000;

app.engine("hbs", engine({ extname: "hbs" }));
app.set("view engine", "hbs");
app.set("views", "./views");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'))

app.get("/", (req, res) => {
  res.redirect("/restaurants");
});

app.get("/restaurants", (req, res) => {
  const keyword = req.query.keyword;
  const restaurantAttributes = [
    "name",
    "name_en",
    "category",
    "location",
    "description",
  ];
  if (!keyword) {
    return Restaurant.findAll({
      attributes: [
        `id`,
        `name`,
        `name_en`,
        `category`,
        `image`,
        `location`,
        `phone`,
        `google_map`,
        `rating`,
        `description`,
      ],
      raw: true,
    })
      .then((restaurants) => res.render("index", { restaurants }))
      .catch((err) => res.status(422).json(err));
  } else {
    return Restaurant.findAll({
      attributes: [
        `id`,
        `name`,
        `name_en`,
        `category`,
        `image`,
        `location`,
        `phone`,
        `google_map`,
        `rating`,
        `description`,
      ],
      raw: true,
      where: {
        [Op.or]: restaurantAttributes.map((attribute) => ({
          [attribute]: {
            [Op.like]: `%${keyword}%`,
          },
        })),
      },
    })
      .then((restaurants) => res.render("index", { restaurants }))
      .catch((err) => res.status(422).json(err));
  }
});

app.get("/restaurants/new", (req, res) => {
  res.render("new");
});

app.get("/restaurants/:id", (req, res) => {
  const id = req.params.id;
  return Restaurant.findByPk(id, {
    attributes: [
      `id`,
      `name`,
      `name_en`,
      `category`,
      `image`,
      `location`,
      `phone`,
      `google_map`,
      `rating`,
      `description`,
    ],
    raw: true,
  })
    .then((restaurant) => res.render("show", { restaurant }))
    .catch((err) => res.status(422).json(err));
});

app.post("/restaurants", (req, res) => {
  const {
    name,
    name_en,
    category,
    image,
    location,
    phone,
    google_map,
    rating,
    description,
  } = req.body;

  return Restaurant.create({
    name,
    name_en,
    category,
    image,
    location,
    phone,
    google_map,
    rating,
    description,
  })
    .then(() => res.redirect("/restaurants"))
    .catch((err) => res.status(422).json(err));
});

app.get("/restaurants/:id/edit", (req, res) => {
  const id = req.params.id;
  return Restaurant.findByPk(id, {
    attributes: [
      `id`,
      `name`,
      `name_en`,
      `category`,
      `image`,
      `location`,
      `phone`,
      `google_map`,
      `rating`,
      `description`,
    ],
    raw: true,
  })
    .then((restaurant) => res.render("edit", { restaurant }))
    .catch((err) => res.status(422).json(err));
});

app.put("/restaurants/:id", (req, res) => {
  const id = req.params.id;
  const {
    name,
    name_en,
    category,
    image,
    location,
    phone,
    google_map,
    rating,
    description,
  } = req.body;

  return Restaurant.update({
    name,
    name_en,
    category,
    image,
    location,
    phone,
    google_map,
    rating,
    description,
  }, {
    where: {id}
  })
    .then(() => res.redirect("/restaurants"))
    .catch((err) => res.status(422).json(err));
});

app.delete("/restaurants/:id", (req, res) => {
  const id = req.params.id;
  return Restaurant.update()
});

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
