// we are doing this method because we are in Development mode
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const ejsMate = require("ejs-mate");
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");

const MongoStore = require("connect-mongo");

const User = require("./models/user");

const ExpressError = require("./utils/ExpressError");

const campgroundRoutes = require("./routes/campgrounds");
const reviewRoutes = require("./routes/reviews");
const userRoutes = require("./routes/users");

///// Connecting to the Databse mongodb with the user database yelp-camp
// "mongodb://localhost:27017/yelp-camp"
const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/yelp-camp";

mongoose.connect(dbUrl);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error"));
db.once("open", () => {
  console.log("Database Connected");
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use(mongoSanitize());
// app.use(helmet());

// const scriptSrcUrls = [
//   "https://stackpath.bootstrapcdn.com/",
//   "https://api.tiles.mapbox.com/",
//   "https://api.mapbox.com/",
//   "https://cdnjs.cloudflare.com/",
//   "https://cdn.jsdelivr.net",
// ];
// const styleSrcUrls = [
//   "https://stackpath.bootstrapcdn.com/",
//   "https://api.mapbox.com/",
//   "https://api.tiles.mapbox.com/",
//   "https://fonts.google.com/",
// ];
// const connectSrcUrls = [
//   "https://api.mapbox.com/",
//   "https://a.tiles.mapbox.com/",
//   "https://b.tiles.mapbox.com/",
//   "https://events.mapbox.com/",
// ];
// const fontSrcUrls = [];
// app.use(
//   helmet.contentSecurityPolicy({
//     directives: {
//       defaultSrc: [],
//       connectSrc: ["'self'", ...connectSrcUrls],
//       scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
//       styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
//       workerSrc: ["'self'", "blob:"],
//       objectSrc: [],
//       imgSrc: [
//         "'self'",
//         "blob:",
//         "data:",
//         "https://res.cloudinary.com/dhl50zucw/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT!
//         "https://images.unsplash.com/",
//       ],
//       fontSrc: ["'self'", ...fontSrcUrls],
//     },
//   })
// );

const secret = process.env.SECRET || "thisshouldbeabettersecret";

const store = MongoStore.create({
  mongoUrl: dbUrl,
  secret,
  touchAfter: 24 * 60 * 60, //in seconds
});

store.on("error", function (err) {
  console.log("Session Store Error: " + err);
});

const sessionConfig = {
  store,
  name: "session",
  secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    // secure: true, // we will comment this out for development phase as we work on localhost which is not a https request but for production phase we need it as it will only allow the https request
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7, //in milliseconds
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

app.use(session(sessionConfig)); // session must be used before the passport.session
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate())); // telling passport to use the local strategy defind in the user model by passport-local-mongoose

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  if (!["/login", "/"].includes(req.originalUrl)) {
    req.session.returnTo = req.originalUrl;
  }
  // console.log(req.session.returnTo);
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

////// Checking the connectivity of Database

app.use("/", userRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/reviews", reviewRoutes);

app.get("/", (req, res) => {
  res.render("home");
});

//order matters as if none of the above route matches then only it will run and will show the error page
app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found !!!", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) {
    err.message = "Something Went Wrong !!!";
  }
  res.status(statusCode).render("error", { err });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Listening on Port ${port}`);
});
