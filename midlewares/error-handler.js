module.exports = (error, req, res, next) => {
  console.log(error)
  req.flash('error', error.message || '處理失敗')
  res.redirect("back");
  
  next(error)
};