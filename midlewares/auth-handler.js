module.exports = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "尚未登入");
    return res.redirect('/login')
  }
  return next()
}