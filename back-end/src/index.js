const path = require("path");
const express = require("express");
const handlebars = require("express-handlebars");
const bodyParser = require('body-parser');
const route = require("./routes/index");
const db = require("./config/db");
const methodOverride = require('method-override')
//Connect to DB
db.Connect();

const hbs = handlebars.create({});

const myWeb = express();
const port = 3000;
myWeb.use(express.urlencoded({ extended: true }));
myWeb.use(express.static(path.join(__dirname, "public"))); //static file
myWeb.use(bodyParser.urlencoded({ extended: true }));
myWeb.use(bodyParser.json());
myWeb.use(
  express.urlencoded({
    extended: true,
  })
); //middleware
myWeb.use(express.json());
//template engine
//Sets handlebars configurations
myWeb.engine(
  "hbs",
  handlebars.engine({ defaultLayout: "main", extname: ".hbs" })
);
myWeb.set("view engine", "hbs");
myWeb.set("views", path.join(__dirname, "resources/views"));

hbs.handlebars.registerHelper('indexAddOne', function(index) {
  return index + 1;
})

myWeb.use(methodOverride('_method'));

hbs.handlebars.registerHelper('isChecked', (value, category) => {
  return value === category ? 'checked' : '';
});


hbs.handlebars.registerHelper('formatDate', function(dateString) {
  const date = new Date(dateString);
  const newdate = date.toISOString().split('T')[0];;
  return newdate;
});
//Routes init
route(myWeb);

myWeb.listen(port, () =>
  console.log(`Example myWeb listening at http://localhost:${port}!`)
);

