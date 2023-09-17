const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const passport = require("passport");
const LocalStrategy = require("passport-local");

const db = require("../models");
const User = db.User;

const restaurants = require("./restaurants");
const authHandler = require("../midlewares/auth-handler");

passport.use(
  new LocalStrategy((username, password, done) => {
    return User.findOne({
      where: { name: username },
      raw: true
    })
      .then((user) => {
        if (!user) {
          return done(null, false, { message: "帳號不存在" });
        }
        return bcrypt.compare(password, user.password).then((isMatch) => {
          if (!isMatch) {
            return done(null, false, { message: "密碼錯誤" });
          }
          return done(null, user);
        });
      })
      .catch((error) => {
        error.message = "登入失敗";
        done(error);
      });
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  return User.findByPk(id)
    .then((user) => {
      done(null, user);
  });
});


router.use("/restaurants", authHandler, restaurants);

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

  return bcrypt.hash(password, 10)
    .then((hash) => {
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
    })
});

router.post("/logout", (req, res, next) => {
  req.logout((error) => {
    if (error) {
      return next(error)
    }
    req.flash("success", "登出成功");
    return res.redirect("/login");
  });
});

module.exports = router;
