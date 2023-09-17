const express = require("express");
const app = express();

if (process.env.NODE_ENV === 'development') {
  require('dotenv').config()
}

const { engine } = require("express-handlebars");
const methodOverride = require("method-override");
const flash = require("connect-flash");
const session = require("express-session");
const router = require("./routes");
const passport = require('./config/passport')

const messageHandler = require('./midlewares/message-handler')
const errorHandler =require('./midlewares/error-handler');

const port = 3000;

app.engine("hbs", engine({ extname: "hbs" }));
app.set("view engine", "hbs");
app.set("views", "./views");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(flash())

app.use(passport.initialize());
app.use(passport.session());

app.use(messageHandler)

app.use(router);

app.use(errorHandler)

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
