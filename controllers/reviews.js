const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.createReview = async (req, res) => {
    let listing = await Listing.findById(req.params.id).populate("reviews");

    if (!listing) {
        throw new Error("Listing not found"); 
    }
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success", "New Review Created...!!!");
    console.log(listing.reviews);
    console.log("Response sent");
    //res.render('listing/show', { listing });
    res.redirect(`/listings/${listing._id}`);
}

module.exports.deleteReview = async(req,res)=>{
    let {id, reviewId} = req.params;
    // console.log("Listing ID:", id);
    // console.log("Review ID:", reviewId);
    await Listing.findByIdAndUpdate(id, {$pull: {reviews:reviewId}})
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", " Review Deleted...!!!");
    res.redirect(`/listings/${id}`);
}