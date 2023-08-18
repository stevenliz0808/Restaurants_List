const express = require("express");
const { engine } = require("express-handlebars");
const app = express();
const port = 3000;
const restaurants = require("./public/jsons/restaurant.json").results;

app.engine("hbs", engine({ extname: "hbs" }));
app.set("view engine", "hbs");
app.set("views", "./views");

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.redirect("/restaurants");
});

app.get("/restaurants", (req, res) => {
  const keyword = req.query.keyword;
  const filteredRestaurants = keyword
    ? restaurants.filter((restaurant) =>
        Object.values(restaurant).some((property) => {
          if (typeof property === 'string') {
            return property.toLowerCase().includes(keyword.toLowerCase());
          }
          return false
        })
      )
    : restaurants;
  res.render("index", { restaurants: filteredRestaurants, keyword });
});

app.get("/restaurants/:id", (req, res) => {
  const id = req.params.id;
  const restaurant = restaurants.find(
    (restaurant) => restaurant.id.toString() === id
  );
  res.render("show", { restaurant });
});

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
