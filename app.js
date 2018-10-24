var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var Handlebars = require('handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');

var app = express();


var server = require('http').Server(app);  

//database connection
require("./mongo");

//Route Define
var routes = require('./routes/index');
var users = require('./routes/users');

// View Engine

app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout:'layout'}));
app.set('view engine', 'handlebars');

Handlebars.registerHelper("math", function(lvalue, operator, rvalue, options) {
  lvalue = parseFloat(lvalue);
  rvalue = parseFloat(rvalue);
      
  return {
      "+": lvalue + rvalue,
      "-": lvalue - rvalue,
      "*": lvalue * rvalue,
      "/": lvalue / rvalue,
      "%": lvalue % rvalue
      
  }[operator];
});

Handlebars.registerHelper('compare', function(lvalue, rvalue, options) {

	if (arguments.length < 3)
	    throw new Error("Handlerbars Helper 'compare' needs 2 parameters");

	operator = options.hash.operator || "==";

	var operators = {
	    '==':       function(l,r) { return l == r; },
	    '===':      function(l,r) { return l === r; },
	    '!=':       function(l,r) { return l != r; },
	    '<':        function(l,r) { return l < r; },
	    '>':        function(l,r) { return l > r; },
	    '<=':       function(l,r) { return l <= r; },
	    '>=':       function(l,r) { return l >= r; },
	    'typeof':   function(l,r) { return typeof l == r; }
	}

	if (!operators[operator])
	    throw new Error("Handlerbars Helper 'compare' doesn't know the operator "+operator);

	var result = operators[operator](lvalue,rvalue);

	if( result ) {
	    return options.fn(this);
	} else {
	    return options.inverse(this);
	}
});



// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname + '/node_modules'));  


// Express Session
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());
//app.use(passport.authenticate('google', { scope: ['profile'] } ));

// Express Validator CheckBody Function
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.')
        , root    = namespace.shift()
        , formParam = root;
  
      while(namespace.length) {
        formParam += '[' + namespace.shift() + ']';
      }
      return {
        param : formParam,
        msg   : msg,
        value : value
      };
    }
  }));

   // Connect Flash
app.use(flash());

// Global Vars
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.messages = req.flash('messages');
  //res.locals.messages = req.messages || null;
  res.locals.user = req.user || null;
  next();
});



app.use('/', routes);
app.use('/users', users);


server.listen(3000,()=>{
    console.log('Listing To port http://localhost:3000');
  })
  




