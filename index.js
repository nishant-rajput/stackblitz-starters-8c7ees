let express = require('express');
let cors = require('cors');
let sqlite3 = require('sqlite3').verbose();
let { open } = require('sqlite');
const path = require('path');

let app = express();
let port =  3000;
app.use(cors());


let db;

(async () => {
  db = await open({
    filename: path.resolve(__dirname, './database.sqlite'),
    driver: sqlite3.Database,
  });
})();

async function fetchAllRestaurants() {
  let query = 'SELECT * from restaurants';
  let response = await db.all(query, []);
  return { restaurants: response };
}
async function fetchRestaurantByID(id) {
  let query = 'SELECT * from restaurants where id=?';
  let response = await db.all(query, [id]);
  return { restaurants: response };
}
async function fetchRestaurantByCuisine(cuisine) {
  let query = 'SELECT * from restaurants where cuisine=?';
  let response = await db.all(query, [cuisine]);
  return { restaurants: response };
}
async function sortByRating() {
  let query = 'SELECT * from restaurants ORDER BY rating';
  let response = await db.all(query, []);
  return { restaurants: response };
}
async function filterRestaurants(isVeg, hasOutdoorSeating, isLuxury) {
  let query =
    'SELECT * from restaurants WHERE isVeg=? AND hasOutdoorSeating=? AND isLuxury=?';
  let response = await db.all(query, [isVeg, hasOutdoorSeating, isLuxury]);
  return { restaurants: response };
}
async function fetchAllDishes() {
  let query = 'SELECT * from dishes';
  let response = await db.all(query, []);
  return { dishes: response };
}

async function fetchDishesByID(id) {
  let query = 'SELECT * from dishes where id=?';
  let response = await db.all(query, [id]);
  return { dishes: response };
}

async function sortDishesByPrice() {
  let query = 'SELECT * from dishes ORDER BY price';
  let response = await db.all(query, []);
  return { dishes: response };
}
async function filterDishesbyIsVeg(isVeg) {
  let query = 'SELECT * from dishes where isVeg=?';
  let response = await db.all(query, [isVeg]);
  return { dishes: response };
}

app.get('/restaurants', async (req, res) => {
  let results = await fetchAllRestaurants();
  res.status(200).json(results);
});
app.get('/restaurants/details/:id', async (req, res) => {
  let id = req.params.id;
  let results = await fetchRestaurantByID(id);
  res.status(200).json(results);
});
app.get('/restaurants/cuisine/:cuisine', async (req, res) => {
  let cuisine = req.params.cuisine;
  let results = await fetchRestaurantByCuisine(cuisine);
  res.status(200).json(results);
});
app.get('/restaurants/filter', async (req, res) => {
  let isVeg = req.query.isVeg;
  let hasOutdoorSeating = req.query.hasOutdoorSeating;
  let isLuxury = req.query.isLuxury;
  let results = await filterRestaurants(isVeg, hasOutdoorSeating, isLuxury);
  res.status(200).json(results);
});
app.get('/restaurants/sort-by-rating', async (req, res) => {
  let results = await sortByRating();
  res.status(200).json(results);
});
app.get('/dishes', async (req, res) => {
  let results = await fetchAllDishes();
  res.status(200).json(results);
});
app.get('/dishes/filter', async (req, res) => {
  let isVeg = req.query.isVeg;
  let results = await filterDishesbyIsVeg(isVeg);
  res.status(200).json(results);
});
app.get('/dishes/sort-by-price', async (req, res) => {
  let results = await sortDishesByPrice();
  res.status(200).json(results);
});
app.get('/dishes/details/:id', async (req, res) => {
  let id = req.params.id;
  let results = await fetchDishesByID(id);
  res.status(200).json(results);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
