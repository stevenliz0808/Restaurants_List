const express = require("express");
const router = express.Router();

const { Op } = require("sequelize");

const db = require("../models");
const Restaurant = db.Restaurant;

router.get("/", (req, res) => {
  const keyword = req.query.keyword;
  const sort = req.query.sort
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
      order: [sort? `${sort}` : 'name']
    })
      .then((restaurants) => res.render("index", { restaurants, sort}))
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
      order: [sort? `${sort}` : 'name']
    })
      .then((restaurants) => res.render("index", { restaurants, keyword, sort}))
      .catch((err) => console(err));
  }
});

router.get("/new", (req, res) => {
  res.render("new");
});

router.get("/:id", (req, res) => {
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

router.post("/", (req, res) => {
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

  if (!name) {
    return res.status(400).json({message: '不能空白'})
  }
  else {
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
  }
});

router.get("/:id/edit", (req, res) => {
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

router.put("/:id", (req, res) => {
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

  return Restaurant.update(
    {
      name,
      name_en,
      category,
      image,
      location,
      phone,
      google_map,
      rating,
      description,
    },
    {
      where: { id },
    }
  )
    .then(() => res.redirect("/restaurants"))
    .catch((err) => res.status(422).json(err));
});

router.delete("/:id", (req, res) => {
  const id = req.params.id;
  return Restaurant.destroy({
    where: { id },
  })
    .then(() => res.redirect("/restaurants"))
    .catch((err) => res.status(422).json(err));
});

module.exports = router;
