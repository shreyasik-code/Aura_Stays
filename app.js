if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}


const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const listingsRouter = require("./routes/listing.js"); 
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user.js");

const dbUrl = process.env.ATLASDB_URL;

main()
    .then((res) => {
    console.log("Connection successful");
    })
    .catch((err) => {
    console.log(err);
});
async function main(){
    await mongoose.connect(dbUrl);
};

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchafter: 24*3600,
});

store.on("error", () =>{
    console.log("ERROR in MOGO SESSION STORE", err);
});

const sessionOptions = {
    store,
    secret : process.env.SECRET,
    resave : false,
    saveUninitialized : true,
    cookie : {
        expires: Date.now() + 7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly : true,
    },
};


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.message = req.flash("error");
    res.locals.currUser = req.user;
    next();
})

//const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";



// app.get("/", (res , req) => {
//     req.send("Working...!!!");
// });


app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);


app.get("/testlisting", async (req,res) =>{
    let samplelisting = new Listing({
        title : "My new Villa",
        description : "By the beach",
        price : 1500,
        location : "Calangute, Goa",
        country : "India",
    })
    await samplelisting.save();
    console.log("Sample was saved");
    res.send("Successful testing");
});





//...................Review's POST Route......................
// app.post("/listings/:id/reviews",validateReview,  wrapAsync((req,res) =>{
//     let listing =  Listing.findById(req.params.id);
//     let newReview = new Review(req.body.review);
//     listing.reviews.push(newReview);


//     newReview.save();
//     listing.save();

//     console.log("response send");
//     //res.send("Done");
//     res.render('show', { comment });


//     res.redirect(`/listings/${listing._id}`);
// }));



app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});

// ----------------Error ---------------
// app.use((err, req, res, next) => {
//     let{statusCode = 500, message= "Something went wrong" } = err;
//     res.render("error.ejs",{message});
//     //res.status(statusCode).send(message);
    
// });

// Error handler (put this after all your routes)
app.use((err, req, res, next) => {
    console.log("ERROR HANDLER CALLED"); 
    const { statusCode = 500, message = "Something went wrong!" } = err;
    res.status(statusCode).render("error", { message }); 
});
  

  
app.get('/test-navbar', (req, res) => {
    res.render('includes/navbar.ejs');
});
  

app.listen(8080, () => {
    console.log("Listening on port 8080 : ");
});

//const path = require("path");

//passport.use(new localStrategy(User.authenticate()));