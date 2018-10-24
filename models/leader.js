var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var validateEmail = function(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};
var LeaderSchema=mongoose.Schema({
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
       Profileimg: {
        type: String,
        required:[true,'Please require Product Image'],
     },
     Qulification :{
         type:String,
         required:[true,"Required must Qulification"]
     } ,
     Gender :{
        type:String,
        required:[true,"Required must Gender"]
    } ,
    Party :{
        type:String,
        required:[true,"Required must Party"]
    } ,
    Mstatus :{
        type:String,
        required:[true,"Required Mstatus"]
    } ,
    Constituency :{
        type:String,
        required:[true,"Required Constituency"]
    } ,
    CDesignation :{
        type:String,
        required:[true,"Required Current Designation"]
    } ,
    CYear :{
        type:String,
        required:[true,"Required Current Designation Year"]
    } ,
    Pdesignation :{
        type:String,
        required:[true,"Required Previous Designation"]
    } ,
    PYear :{
        type:String,
        required:[true,"Required Previous Designation Year"]
    } ,
   },

   {
   timestamps: true,
   
    });
 
    LeaderSchema.plugin(mongoosePaginate);

var Leader = module.exports = mongoose.model('Leader', LeaderSchema);