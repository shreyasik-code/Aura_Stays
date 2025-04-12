const express = require("express");
const router = express.Router({mergeParams : true});
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/review.js");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js");

//-----------Controller --> Revires.js-----------------
const reviewController = require("../controllers/reviews.js");


//...................Review's POST Route......................
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));


//---------------------- Review's Delete Route------------
router.delete("/:reviewId", isLoggedIn,isReviewAuthor,wrapAsync(reviewController.deleteReview));

module.exports = router;