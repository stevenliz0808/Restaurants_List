const express = require("express");
const app = express();


const { Op } = require("sequelize");

const { engine } = require("express-handlebars");
const methodOverride = require("method-override");
const router = require("./routes");

const port = 3000;

app.engine("hbs", engine({ extname: "hbs" }));
app.set("view engine", "hbs");
app.set("views", "./views");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'))

app.use(router)

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
