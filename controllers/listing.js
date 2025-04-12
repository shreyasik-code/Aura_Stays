const Listing = require("../models/listing")

module.exports.index = async (req,res) => {
    const alllistings = await Listing.find({});
    res.render("listings/index.ejs", { alllistings });

};

module.exports.renderNewForm = (req,res) => {
    res.render("listings/new.ejs");
};

module.exports.showListing = async(req,res) =>{
    try{
    let {id} = req.params;
    const listing = await Listing.findById(id)
    .populate({
        path : "reviews", 
        populate : {
            path: "author",
        },
    })
    .populate("owner");
    if(!listing){
        req.flash("error", "Listing you requested does not exist...!!!");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
    }catch(err){
        next (err); //console.log(listing);
    }
};

module.exports.createListing = async (req, res, next) => {
    // if(!req.body.listing){
    //     throw new ExpressError(400, "Send valid data for listing");
    // }
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id; 
    newListing.image = {url, filename};
    await newListing.save();
    req.flash("success", "New Listing Created...!!!");
    //console.log("Flash message stored:", req.flash("success"));
    res.redirect("/listings");
}


module.exports.renderEditForm = async(req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing you requested does not exist...!!!");
        res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/edit.ejs",{listing});
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "upload/w_250");
    res.render("listings/edit.ejs", { listing, originalImageUrl });
};

// module.exports.updateListing = async(req,res) => {
//     // if(!req.body.listing){
//     //     throw new ExpressError(400, "Send valid data for listing");
//     // }
//     let {id} = req.params;
//     let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});
//     let url = req.file.path;
//     let filename = req.file.filename;
//     listing.image = { url,  filename };
//     await listing.save();
//     req.flash("success", "listing updated...!!!");
//     res.redirect(`/listings/${id}`);
// }

module.exports.updateListing = async (req, res, next) => {
    try {
        const { id } = req.params;
        const listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true });
        if (req.file) {
            listing.image = {
                url: req.file.path,
                filename: req.file.filename
            };
            await listing.save(); 
        }

        req.flash("success", "Listing updated...!!!");
        return res.redirect(`/listings/${id}`); 

    } catch (err) {
        return next(err); 
    }
};



module.exports.destroyListing = async(req,res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "listing Created...!!!");
    res.redirect("/listings");
}
