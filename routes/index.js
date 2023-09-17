const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const passport = require("passport");
const LocalStrategy = require("passport-local");
const FacebookStrategy = require("passport-facebook");

const db = require("../models");
const User = db.User;

const restaurants = require("./restaurants");
const authHandler = require("../midlewares/auth-handler");

passport.use(
  new LocalStrategy((username, password, done) => {
    return User.findOne({
      where: { name: username },
      raw: true,
    })
      .then((user) => {
        if (!user) {
          return done(null, false, { message: "帳號不存在" });
        }
        return bcrypt.compare(password, user.password).then((isMatch) => {
          if (!isMatch) {
            return done(null, false, { message: "密碼錯誤" });
          }
          return done(null, user, { message: "登入成功" });
        });
      })
      .catch((error) => {
        error.message = "系統錯誤，登入失敗";
        done(error);
      });
  })
);

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: "http://localhost:3000/auth/facebook/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      return User.findOne({
        where: { name: profile.id },
        raw: true
      })
        .then((user) => {
          if (user) {
            return done(null, user, { message: "登入成功" });
          }
          const randomPwd = Math.random().toString(36).slice(-8);
          return bcrypt.hash(randomPwd, 10)
            .then((hash) => {
              User.create({name: profile.id, password: hash})
            })
            .then((user) => {
              done(null, user, { message: "註冊成功" });
            })
        })
        .catch((error) => {
          error.message = "系統錯誤，Facebook登入失敗";
          done(error);
        });
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  return User.findByPk(id).then((user) => {
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

router.get("/auth/facebook", passport.authenticate("facebook"));

router.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", {
    failureRedirect: "/login",
    successRedirect: "/restaurants",
    failureFlash: true,
  })
);

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
