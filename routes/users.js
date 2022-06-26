const express = require("express");
const router = express.Router();
const passport = require("passport");

const User = require("../models/user");

const users = require("../controllers/users");

const ExpressError = require("../utils/ExpressError");
const catchAsync = require("../utils/catchAsync");

router
  .route("/register")
  .get(users.renderRegister)
  .post(catchAsync(users.register));

router
  .route("/login")
  .get(users.renderLogin)
  .post(
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    users.login
  );

router.get("/logout", users.logout);

module.exports = router;
