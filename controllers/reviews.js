const Campground = require("../models/campgrounds");
const Review = require("../models/review");

module.exports.createReview = async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  const review = new Review(req.body.review); // passing review as we defined it like that only int form
  review.author = req.user._id;
  campground.reviews.push(review);
  await review.save();
  await campground.save();
  req.flash("success", "Review Created Successfully");
  res.redirect(`/campgrounds/${campground.id}`);
};

module.exports.deleteReview = async (req, res, next) => {
  const { id, reviewId } = req.params;
  await Campground.findByIdAndUpdate(id, { $pull: { review: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Review Deleted Successfully");
  res.redirect(`/campgrounds/${id}`);
};
