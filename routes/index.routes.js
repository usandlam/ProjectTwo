const router = require("express").Router();

const control = require('../middleware/mustBeLoggedIn.js');

/* GET home page */
router.get("/", (req, res, next) => {
  console.log(req.session);
  res.render("index",{userSession: req.session.passport});
});


//split into post-auth / "USER" routes?
router.get("/main", control(), (req, res, next) => {
  res.render("main",{userSession: req.session.passport});
});

router.get("/profile", control(), (req, res, next) => {
  res.render("profile",{userSession: req.session.passport});
});


module.exports = router;
