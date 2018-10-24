var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var bcrypt = require('bcryptjs');
var validateEmail = function(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

var UserSchema=mongoose.Schema({
    Name: {
       type: String,
       required: "Name is Required"
     },
    Email: {
       type: String,
       validate: [validateEmail, 'Please fill a valid email address'],
       match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
       index: {
           unique: true,
            dropDups: true
           }
     },
     MobileNo: {
       type: String,
       required: [true, 'User phone number required'],  

     },
     password :{
         type:String,
         required:[true,"Password must required"]
     } ,
     resetPasswordToken:{
       type:String
     } ,
     resetPasswordExpires:
     {
       type:Date
     }
    
   },

   {
   timestamps: true,
   
    });
 
UserSchema.plugin(mongoosePaginate);

var User = module.exports = mongoose.model('User', UserSchema);
module.exports.createUser = function(newUser, callback){
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(newUser.password, salt, function(err, hash) {
	        newUser.password = hash;
	        newUser.save(callback);
	    });
	});
}
module.exports.getUserByEmail = function(username, callback){
	var query = {Email: username};
	User.findOne(query, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    	if(err) throw err;
    	callback(null, isMatch);
	});
}


