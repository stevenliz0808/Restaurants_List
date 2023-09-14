const express = require("express");
const router = express.Router()

const restaurants = require("./restaurants")

const db = require('../models')
const User = db.User

router.use("/restaurants", restaurants)

router.get("/", (req, res) => {
  res.redirect("/restaurants");
});

router.get('/login', (req, res) => {
  res.render('login')
})

router.get("/register", (req, res) => {
  res.render("register");
});

router.post('/register', (req, res) => {
  const {name, password, password2} = req.body
  if (password !== password2) {
    req.flash('error','密碼不一致')
    return res.redirect('back')
  }

  return User.findOrCreate({
    where: {name},
    defaults: {name, password}
  })
    .then(([user, created]) => {
      if (created) {
        req.flash('success', '註冊成功，請重新登錄!')
        res.redirect('/login')
      }
      else {
        req.flash('error', '此用戶已存在')
        res.redirect('back')
      }
    })
    .catch((error) => {
      error.message = '註冊失敗'
      next(error)
    })
})

router.post("/logout", (req, res) => {
  res.send("登出成功");
});

module.exports = router