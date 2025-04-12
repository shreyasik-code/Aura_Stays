const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");


const userSchema = new Schema({
    email : {
        type : String,
        required : true,
    },
});
// const mongoose = require('mongoose');

// const userActivationSchema = new mongoose.Schema({
//     username: { type: String, required: true },
//     email: { type: String, required: true },
//     password: { type: String, required: true },
// });

//module.exports = mongoose.model('UserActivation', userSchema);


// userSchema.plugin(passportLocalMongoose);

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);