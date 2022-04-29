const router = require("express").Router();


const control = require('../middleware/mustBeLoggedIn.js');
// const control = require('../middleware/sessionTrack.js');
const userTrack = require('../middleware/userTrack.js')

const User = require('../models/User.model');

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index"); //,{ flash: req.flash('error') }
});

// userTrack(),
//split into post-auth / "USER" routes?
router.get("/main", (req, res, next) => {
  res.render("main");
});

router.get("/main2", control(), (req, res, next) => {
  res.render("main",{userSession: req.session.passport});
});

router.get("/profile", control(), async (req, res, next) => {
  const id = req.session.passport.user;
  try{
    const userDetails = await User.findById(id);
    // console.log(userDetails);
    res.render("profile",{user: userDetails});
  }catch (err){
    console.log(err);
  }
});


module.exports = router;
