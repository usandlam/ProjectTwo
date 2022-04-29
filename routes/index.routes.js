const router = require("express").Router();


const control = require('../middleware/mustBeLoggedIn.js');
// const control = require('../middleware/sessionTrack.js');
const userTrack = require('../middleware/userTrack.js')


/* GET home page */
router.get("/", (req, res, next) => {
  console.log(req.session);
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

router.get("/profile", control(), (req, res, next) => {
  res.render("profile",);
});


module.exports = router;
