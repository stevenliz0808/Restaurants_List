const passport = require("passport");
const LocalStrategy = require("passport-local");
const FacebookStrategy = require("passport-facebook");
const bcrypt = require('bcrypt')

const db = require("../models");
const User = db.User;

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
      callbackURL: "http://localhost:3000/oauth/facebook/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      return User.findOne({
        where: { name: profile.id },
        raw: true,
      })
        .then((user) => {
          if (user) {
            return done(null, user, { message: "登入成功" });
          }
          const randomPwd = Math.random().toString(36).slice(-8);
          return bcrypt
            .hash(randomPwd, 10)
            .then((hash) => {
              User.create({ name: profile.id, password: hash });
            })
            .then((user) => {
              done(null, user, { message: "註冊成功" });
            });
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

module.exports = passport