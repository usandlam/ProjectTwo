// routes/auth.routes.js
 
const { Router } = require('express');
const router = new Router();

const User = require('../models/User.model');

const bcryptjs = require('bcryptjs');
const saltRounds = 10;

const passport = require('passport');

const mongoose = require('mongoose');

const control = require('../middleware/mustBeLoggedIn.js');

router.get('/signup', (req, res) => res.render('auth/signup'));

router.post('/logout', (req, res, next) => {
    req.session.destroy(err => {
      if (err) next(err);
      res.redirect('/');
    });
  });

router.get('/login', (req, res) => {
  res.render('auth/login', { flash: req.flash('error') });
});

router.post(
    '/login',
    passport.authenticate(
      'local',
      {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
      }
    )
  );

router.post('/signup', async (req,res,next) =>{
const { username, email, password } = req.body;
    if(!username || !password){
        res.render('auth/signup', { errorMessage: 'Required field missing', attempt: username});
        return;
    }
    try{
        const hashed =  await saltPassword(password);
        const newUser = await User.create({username,email,passwordHash:hashed});
        console.log('User created ', newUser);
        res.render('auth/login',{successMessage: `${username} created!  You can now login below`});
    }catch (err){
        if (err instanceof mongoose.Error.ValidationError) {
             res.status(500).render('auth/signup', { errorMessage: err.message, attempt: username });
        } else if (err.code === 11000) {
             res.status(500).render('auth/signup', {
            errorMessage: 'Username already in use - must be unique.'
        });
        }
        console.log('Failed to create user ',err);
        next(err);
    }
});

// router.get('/main' ,(req, res, next) => res.render('main',{ userSession: req.session.currentUser }));


async function saltPassword(password){
    try{
        const hashedPassword = await bcryptjs.hash(password,saltRounds);
        console.log(hashedPassword);
        return hashedPassword;
    }catch{
        console.log('Failed to encrypt PW - dying');
    }
}

module.exports = router;