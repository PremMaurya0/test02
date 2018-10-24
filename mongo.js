const mongoose = require("mongoose");
//require("dotenv").config();
const mongoDBErrors = require("mongoose-mongodb-errors");

mongoose.Promise = global.Promise;
mongoose.plugin(mongoDBErrors);
mongoose.connect("mongodb://localhost:27017/INLDUsers",{ useNewUrlParser: true });

var cnn=mongoose.connection;

cnn.on("connected",function(){
    console.log("Connected Successfully!");
});
cnn.on("disconnected",function(){
    console.log("Disconnected Successfully!");
});
cnn.on('error',console.error.bind(console,"Error Dedected!!!"));