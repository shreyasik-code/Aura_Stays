const User = require("../models/user.js");

module.exports.renderSignupForm = (req,res) => {
    // res.send("form");
    res.render("users/signup.ejs");
    //console.log(path.resolve("views/users/signup.ejs"));
}

module.exports.signup = async(req,res) => {
    try{
        let {username, email, password} = req.body;
        const newUser = new User({email, username});
        const registeredUser = await User.register(newUser,password);
        //console.log(UserActivation);

        console.log(registeredUser);
        req.login(registeredUser, (err) => {
            if(err) {
                return next(err);
            }
            req.flash("success", "Welcomw to Wanderlust");
            res.redirect("/listings");
        });
    } catch(e){
        req.flash("error", e.message);
        res.redirect("/signup");
    }
    
}

module.exports.renderLoginForm = (req,res) => {
    // res.send("form");
    res.render("users/login.ejs");
    //console.log(path.resolve("views/users/signup.ejs"));
}

module.exports.login = async(req,res) => {
    req.flash("success", "Welcome back...! You are logged in...");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}

module.exports.logout = (req,res) => {
    req.logout((err) => {
        if(err){
            next(err);
        }
        req.flash("success","you are logged out...!");
        res.redirect("/listings");
    });
}