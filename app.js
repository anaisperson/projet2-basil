require("dotenv").config();

const PORT = process.env.PORT || 3000;

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const express = require("express");
const mongoose = require("mongoose");
const logger = require("morgan");
const path = require("path");
const session = require("express-session");
const hbs = require('hbs');
const HandlebarsIntl = require('handlebars-intl');
hbs.handlebars = require('handlebars');
HandlebarsIntl.registerWith(hbs);

mongoose
    .connect(process.env.MONGODB_URI || 'mongodb://localhost/basil-v2', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then((x) => {
        console.log(
            `Connected to Mongo! Database name: "${x.connections[0].name}"`
        );
    })
    .catch((err) => {
        console.error("Error connecting to mongo", err);
    });

const app_name = require("./package.json").name;
const debug = require("debug")(
    `${app_name}:${path.basename(__filename).split(".")[0]}`
);

const app = express();

// Middleware Setup
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.raw());
app.use(cookieParser());
app.use(
    session({
        secret: "s3cr3t",
        resave: false,
        saveUninitialized: false,
        cookie: { maxAge: 3600000 },
    })
);

app.set("views", path.join(__dirname, "views"));

hbs.registerHelper('equalRate', function(value1, value2) {
    return value1 === value2;
});
app.set("view engine", "hbs");
app.engine('hbs', require('hbs').__express);

app.use(express.static(path.join(__dirname, "public")));
// app.use(favicon(path.join(__dirname, "public", "images", "favicon.ico")));

// default value for title local
app.locals.title = "Basil";

app.use("/", require("./routes/index"));
app.use("/users", require("./routes/users"));
app.use("/rates", require("./routes/rates"));

app.listen(PORT);

module.exports = app;