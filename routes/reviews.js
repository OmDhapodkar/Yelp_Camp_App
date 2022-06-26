const express = require("express");
const router = express.Router({ mergeParams: true }); // this will allow to let us use id parameter to access reviews

const { reviewSchema } = require("../schemas");

const Campground = require("../models/campgrounds");
const Review = require("../models/review");

const reviews = require("../controllers/reviews");

const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");

const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware");

router.post("/", isLoggedIn, validateReview, catchAsync(reviews.createReview));

router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  catchAsync(reviews.deleteReview)
);

module.exports = router;
