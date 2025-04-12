const express = require("express");
const router = express.Router();
//const path = require("path");
const User = require("../models/user.js");
const localStrategy = require('passport-local').Strategy;
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
//const UserActivation = require('../models/UserActivation'); 

const userController = require("../controllers/users.js");

router.route("/signup")
.get(userController.renderSignupForm)
.post(wrapAsync(userController.signup));

router.route("/login")
.get(userController.renderLoginForm)
.post(saveRedirectUrl, passport.authenticate("local", {failureRedirect : '/login', failureFlash : true}), userController.login);


router.get("/logout", userController.logout);

passport.use(new localStrategy(User.authenticate()));
module.exports = router;