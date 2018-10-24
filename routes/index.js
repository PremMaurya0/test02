var express = require('express');
var router = express.Router();

const Recordset=[1,2,30,50,100];

var Leader = require('../models/leader');
router.get('/', function(req, res){
	res.render("login",{title:"INLD Login"});
});

router.get('/users/dashboard',ensureAuthenticated, function(req, res){
	res.render("index",{title:"Welcome",user:req.user});
});
router.get('/users/register-leader',ensureAuthenticated, function(req, res){
	res.render("register",{title:"Register Leader",user:req.user});
});


var perPage;
router.get('/users/polytical-leaders/',ensureAuthenticated, function(req, res){
	
// 	var page = req.body.page || 1
// 	if(req.body.Record==undefined){
// 	   perPage= 1;
//    }

//    if(req.body.page<=0){
// 	res.render('leaders',{message:"No negative value accepted!!"});
// }else{
	// Leader.find().skip((perPage * page) - perPage)
	// .limit(perPage).exec((err, Leaderdata)=>{
	// 	if(err) throw err;
	// 	Leader.find().countDocuments().exec(function(err, count) {
	// 		if(err) throw err;
	// 		if(req.params.page>parseInt(Math.ceil(count / perPage))){			
	// 			res.render("leaders",{title:"Leader List",message:"Record is not found!!"});
	// 		}else{
				res.render('leaders',{Recordset:Recordset});
	
			//}
	
	//});

	//});
//}

});
//var perPage;
router.post('/users/polytical-leaders',ensureAuthenticated, function(req, res){
console.log(req.body.page);
	var page = req.body.page
	if(req.body.Record==undefined){
	   perPage= 1;
   }
   perPage=parseInt(req.body.Record);

   if(req.body.page<=0){
	res.render('leaders',{message:"No negative value accepted!!"});
}else{
	Leader.find().skip((perPage * page) - perPage)
	.limit(perPage).exec((err, Leaderdata)=>{
		if(err) throw err;
		Leader.find().countDocuments().exec(function(err, count) {
			if(err) throw err;
			if(req.params.page>parseInt(Math.ceil(count / perPage))){			
				res.send({message:"Record is not found!!"});
			}else{
				res.send({LeaderList:Leaderdata,Recordset:Recordset,total:parseInt(count),limit:parseInt(perPage),pages:parseInt(Math.ceil(count / perPage)),current:parseInt(page)});
	
			}
	
	});

	});
}

});



function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
      
		res.redirect('/');
	}
}

module.exports = router;