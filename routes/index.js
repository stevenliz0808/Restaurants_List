const express = require("express");
const router = express.Router();
const passport = require('passport')
const bcrypt = require("bcrypt");

const db = require("../models");
const User = db.User;

const restaurants = require("./restaurants");
const oauth = require('./oauth')
const authHandler = require("../midlewares/auth-handler");

router.use("/restaurants", authHandler, restaurants);
router.use('/oauth', oauth)

router.get("/", (req, res) => {
  res.redirect("/restaurants");
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    successRedirect: "/restaurants",
    failureFlash: true,
  })
);

router.post("/register", (req, res, next) => {
  const { name, password, password2 } = req.body;
  if (password !== password2) {
    req.flash("error", "密碼不一致");
    return res.redirect("back");
  }

  return bcrypt.hash(password, 10).then((hash) => {
    return User.findOrCreate({
      where: { name },
      defaults: { name, password: hash },
    })
      .then(([user, created]) => {
        if (created) {
          req.flash("success", "註冊成功，請重新登錄!");
          res.redirect("/login");
        } else {
          req.flash("error", "此用戶已存在");
          res.redirect("back");
        }
      })
      .catch((error) => {
        error.message = "註冊失敗";
        next(error);
      });
  });
});

router.post("/logout", (req, res, next) => {
  req.logout((error) => {
    if (error) {
      return next(error);
    }
    req.flash("success", "登出成功");
    return res.redirect("/login");
  });
});

module.exports = router;
