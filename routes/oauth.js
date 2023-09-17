const express = require("express");
const router = express.Router();
const passport = require("passport");

router.get("/facebook", passport.authenticate("facebook"));

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    failureRedirect: "/login",
    successRedirect: "/restaurants",
    failureFlash: true,
  })
);

module.exports = router