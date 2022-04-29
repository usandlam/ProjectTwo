// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv/config");

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require("hbs");

const app = express();

const flash = require('connect-flash');

const sessionTrack = require("./middleware/sessionTrack");

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);

const User = require('./models/User.model');

const session = require('express-session');
const MongoStore = require('connect-mongo');
 
const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

app.set('trust proxy', 1);

app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: true,
      saveUninitialized: false, // <== false if you don't want to save empty session object to the store
      cookie: {
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 900000 // 60 * 1000 ms === 1 min
      },
      store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost/ProjectTwo'
      })
    })
  );

passport.serializeUser((user, cb) => cb(null, user._id));
 
passport.deserializeUser((id, cb) => {
  User.findById(id)
    .then(user => cb(null, user))
    .catch(err => cb(err));
});
 
passport.use(new LocalStrategy((username, password, done) => {
    const errorMsg = 'Invalid username or password';

    User.findOne({username})
      .then(user => {
        // if no matching user was found...
        if (!user) {
          return done(null, false, {message: errorMsg});
        }

        // call our validate method, which will call done with the user if the
        // passwords match, or false if they don't
        return user.validatePassword(password)
          .then(isMatch => done(null, isMatch ? user : false, isMatch ? null : { message: errorMsg }));
      })
      .catch(done);
  }));


app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

// default value for title local
const capitalized = require("./utils/capitalized");
const projectName = "ProjectTwo";

app.locals.appTitle = `${capitalized(projectName)}`;

hbs.registerPartials(__dirname + "/views/partials");

/*
app.use( (req,res,next) => {
    console.log(req.session);
    console.log(app.locals);
    if(req.isAuthenticated){
        app.locals.userSession = req.session.passport;
    }else{
        app.locals.userSession = undefined;
    }
    next();
});
*/
app.use(sessionTrack);

// 👇 Start handling routes here
const index = require("./routes/index.routes");
app.use("/", index);

const authRouter = require('./routes/auth.routes'); 
app.use('/', authRouter); 

const boardRouter = require('./routes/board.routes'); 
app.use('/', boardRouter); 

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

// app.use(sessionTrack());

module.exports = app;
