// const mongoose = require("mongoose");
// const Schema = mongoose.Schema;

// const listingSchema = new Schema({
//     title : {
//         type : String,
//         required : true,
//     },
//     description : {
//         type : String,
//     },
//     image : {
//         type : String,
//         url : String,
//         default : "https://www.freepik.com/premium-photo/swimming-pool-resort-night-lighting_11475859.htm#fromView=search&page=1&position=43&uuid=37afc245-4df1-4b6a-8881-98ca8f78b800",
//         set : (v) => 
//             v === ""
//         ? "https://www.freepik.com/premium-photo/swimming-pool-resort-night-lighting_11475859.htm#fromView=search&page=1&position=43&uuid=37afc245-4df1-4b6a-8881-98ca8f78b800"
//         : v,
//     },
//     Price : Number,
//     Location : String,
//     country : String,
// });






// const Listing = mongoose.model("Listing", listingSchema);
// module.exports = Listing;


const { types } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
    image: {
        url: String,
        filename: String,
        // url: {
        //     type: String,
        //     default: "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdvYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
        // },
    },
  price: Number,
  location: String,
  country: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

listingSchema.post("findOneAndDelete", async(listing) => {
  if(listing){
    await Review.deleteMany({ _id: { $in: listing.reviews}});
  }
});


const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;