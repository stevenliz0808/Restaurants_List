const express = require("express");
const router = express.Router();

const { Op } = require("sequelize");

const db = require("../models");
const Restaurant = db.Restaurant;

router.get("/", (req, res, next) => {
  const keyword = req.query.keyword || "";
  const sort = req.query.sort;
  const userId = req.user.id;
  const restaurantAttributes = [
    "name",
    "name_en",
    "category",
    "location",
    "description",
  ];
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
      userId,
    },
    order: [sort ? `${sort}` : "name"],
  })
    .then((restaurants) => res.render("index", { restaurants, keyword, sort }))
    .catch((err) => next(err));
});

router.get("/new", (req, res) => {
  res.render("new");
});

router.get("/:id", (req, res, next) => {
  const id = req.params.id;
  const userId = req.user.id;
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
      `userId`,
    ],
    raw: true,
  })
    .then((restaurant) => {
      if (!restaurant) {
        req.flash("error", "找不到資料");
        return res.redirect("/restaurants");
      }
      if (restaurant.userId !== userId) {
        req.flash("error", "權限不足");
        return res.redirect("/restaurants");
      }
      return res.render("show", { restaurant });
    })
    .catch((error) => {
      error.message = "資料取得錯誤";
      next(error);
    });
});

router.post("/", (req, res, next) => {
  const userId = req.user.id;
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
    return res.status(400).json({ message: "不能空白" });
  } else {
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
      userId,
    })
      .then(() => res.redirect("/restaurants"))
      .catch((err) => next(err));
  }
});

router.get("/:id/edit", (req, res, next) => {
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
    .catch((err) => next(err));
});

router.put("/:id", (req, res, next) => {
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
    .catch((err) => next(err));
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
