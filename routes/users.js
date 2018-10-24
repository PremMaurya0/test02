var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;


const multer = require('multer');
const path = require('path');



// Set The Storage Engine
const storage = multer.diskStorage({
	destination: './public/uploads/',
	filename: function(req, file, cb){
	  cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
	}
  });
  
  // Init Upload
  const upload = multer({
	storage: storage,
	limits:{fileSize: 1000000},
	fileFilter: function(req, file, cb){
	  checkFileType(file, cb);
	}
  });
  
  // Check File Type
  function checkFileType(file, cb){
	// Allowed ext
	const filetypes = /jpeg|jpg|png|gif/;
	// Check ext
	const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
	// Check mime
	const mimetype = filetypes.test(file.mimetype);
  
	if(mimetype && extname){
	  return cb(null,true);
	} else {
	  cb('Error: Images Only!');
	}
  }

  var User = require('../models/user');
  var Leader = require('../models/leader');
  // Register User


// Register User
router.post('/register', ensureAuthenticated,upload.single('myImage'), function (req, res) {
	var name = req.body.name;
	var email = req.body.email;
	var MobileNo = req.body.mobile;
	var Qulification=req.body.qulification;
	var Gender=req.body.gender;
	var Party=req.body.party;
	var Mstatus=req.body.mstatus;
	var Constituency=req.body.constituency;
	var Cdesignation=req.body.cdesignation;
	var CYear=req.body.cdyear;
	var Pdesignation=req.body.Pdesignation;
	var PYear=req.body.pyear;

		
	// Validation
	req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('mobile', 'MobileNo is required').notEmpty();
    req.checkBody('mobile', 'MobileNo is invalid').isMobilePhone("en-IN");
	req.checkBody('qulification', 'Qulification is required').notEmpty();
	req.checkBody('cdesignation', 'Current Designation is required').notEmpty();
	req.checkBody('cdyear', 'Current Year is required').notEmpty();
	req.checkBody('cdyear', 'Current Year is invalid').isNumeric();
	req.checkBody('Pdesignation', 'Previous Designation is required').notEmpty();
	req.checkBody('pyear', 'Previous Year is invalid').isNumeric();
	//req.checkBody('cpassword', 'Passwords do not match').equals(req.body.password);

	if(req.file==undefined){
								
		req.flash('error', "Please select Image");
		return res.render('register');
	}
	var newLeader =new Leader({
		Name: name,
		Email: email,
		MobileNo:MobileNo,
		Qulification:Qulification,
		Gender:Gender,
		Party:Party,
		Mstatus:Mstatus,
		Constituency:Constituency,
		CDesignation:Cdesignation,
		CYear:CYear,
		Pdesignation:Pdesignation,
		PYear:PYear
		});


	var errors = req.validationErrors();
   
		//console.log(newLeader);

	if (errors) {
		return res.render('register',{userDetails:newLeader,error:errors[0].msg}
		);
		
	}
	else {
	// 	//checking for email are already taken

	     Leader.findOne({ Email: email }).exec((err, LeaderDetails) => {
                      if (err){
                        console.log(err);
                      }
                      else{

                      if(LeaderDetails){ 
                             req.flash('error', 'Your email is already used!');
                               return res.render('register',{
                                     userDetails:newLeader
                                 });
                        }
                        else{
                        
						
							newLeader.Profileimg=req.file.filename;
							newLeader.save(function (err, LeaderDetails) {
								if (err) throw err;   
							 });
							 req.flash('success_msg', 'You are registered and can now login');
							 return res.render('register');
						

                 }
             }
        })
        
	 }
});
//Register User End



//Login Process






passport.use(new LocalStrategy(
	function (username, password,done) {
		User.getUserByEmail(username, function (err, user) {
			 if (err)  throw err
			if (!user) {
				return done(null, false, { message: 'Unknown User' });
			}

			User.comparePassword(password, user.password, function (err, isMatch) {
				if (err) throw err;
				if (isMatch) {
                    
					return done(null, user);
				} else {
					return done(null, false, { message: 'Invalid password' });
				}
			});
		});
}));


passport.serializeUser(function (user, done) {
    done(null, user.Email);
});

passport.deserializeUser(function (username, done) {
     User.getUserByEmail(username, function (err, user) {
          done(err, user);
    });
});

//Database Local Route
router.post('/login',passport.authenticate('local', { successRedirect: '/users/dashboard', failureRedirect: '/', failureFlash: true }),
function (req, res) {
     res.redirect('/');
});

//Log Out

router.get('/logout', function (req, res) {
	req.logout();
	req.flash('success_msg', 'You are logged out');
	res.redirect('/');
});

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
      
		res.redirect('/');
	}
}


module.exports = router;