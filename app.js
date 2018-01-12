const express = require('express');
var app = express();
const path = require('path');
const md5=require('md5');

//var morgan = require('morgan'); //http request logger

var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var url ="mongodb://Esfera:esfera456@ds133547.mlab.com:33547/esferasoft";



//var port = process.env.PORT || 8080;
var port =8080;
var http=require('http').Server(app);
var io=require('socket.io')(http);
       http.listen(port);

var rn = require('random-number');
var gen = rn.generator({
  min:  0
, max:  100
, integer: true
})

var randomColor = require('randomcolor'); // import the script 

const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const dotenv = require('dotenv');

var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;
//const Auth0Strategy = require('passport-auth0');
const flash = require('connect-flash');
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn('/');

/*---------passport-----------*/
passport.use(new LocalStrategy(

  function(username, password, done) {
    console.log(username);
    console.log(password);
      //username='emma@gmail.com';
      //var pwd='emma@123';
     // password=md5(pwd);
     password=md5(password);
      MongoClient.connect('mongodb://Esfera:esfera456@ds133547.mlab.com:33547/esferasoft', function(err, db) {
        //console.log(err);
          if (err) throw err;
          var query = { email: username,password:password };
          db.collection("users").find(query).toArray(function(err, user) {
            if (err) { return done(err); }
            //console.log(user);
            //console.log(err);
              if (user.length<=0) {

                return done(null, null);
              }
              else
              {

               return done(null, user);
              }
              
            db.close();

          });
    });

  }
));

// you can use this section to keep a smaller payload
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

/*------------passport strategy--------------------------*/

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// app.use(
//   session({
//     secret: 'shhhhhhhhh',
//     resave: true,
//     saveUninitialized: true
//   })
// );

app.use(
  session({  secret: 'shhhhhhhhh', store: new MongoStore({ url: 'mongodb://Esfera:esfera456@ds133547.mlab.com:33547/esferasoft' })
  })
);
app.use(passport.initialize());
app.use(passport.session());
//app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());
//app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));


  io.on('connection', function(socket){
        
        console.log('socket started');
          
        socket.on('req_fetchinfo', function(username,room){
        
            //socket.join('room1');
            
               var value=gen();
                var color=randomColor();
               io.to('').emit('get_fetchinfo',value,color);
        });

      });
/*------routes------*/
    app.get('/', function (req, res) {
     // console.log('flash'+req.flash('error'));
      res.render('login',{message:req.flash('error')});
    })
    app.post('/login',passport.authenticate('local', { successRedirect: '/dashboard', failureRedirect: '/', failureFlash: 'Login failed',successFlash: 'Welcome!'  }));

    app.get('/dashboard',ensureLoggedIn,function (req,res){
         // console.log('flash'+req.flash('success')); 
         //---flash will show after login 
        //console.log(JSON.stringify(req.session.passport.user[0].fname));
               io.on('connection', function(socket){
        
                 // console.log('socket started');
                    
                  socket.on('req_fetchinfo', function(username,room){
                  
                     
                        socket.join(req.session.passport.user[0].fname);
                        var value=gen();
                         var color=randomColor();
                        io.to(req.session.passport.user[0].fname).emit('get_fetchinfo',value,color);
                        
                  });

            });
         res.render('dashboard',{message:req.flash('success')});
    });
  /*---------routes end--------*/



