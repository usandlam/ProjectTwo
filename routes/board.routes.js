const router = require("express").Router();

const control = require('../middleware/mustBeLoggedIn.js');

const Board = require('../models/Board.model');
const Tag = require('../models/Tag.model');

/* GET home page */
router.get("/new", (req, res, next) => {
  res.render("boards/new",{userSession: req.session.passport});
});

router.get("/create", async (req, res, next) => {
    try{
        // const newTag = await Tag.create({label:'Audio'})
        const tagList = await Tag.find();
        res.render("boards/new",{userSession: req.session.passport, tags: tagList});
    }catch (err){
        console.log(err);
    }
});

router.post("/create", async (req, res, next) => {
    const {name, type, description, url,topSVG,bottomSVG,altTag} = req.body    
    try{
        const newBoard = await Board.create({title,genre,plot,cast});
    }catch(err){
        res.redirect("/create", { flash: req.flash(err), attempt: name,type,description,url,topSVG,bottomSVG,altTag});
        console.log(err);
    }
    res.redirect("/boards");
});

//res.render('auth/login', { flash: req.flash('error') });

module.exports = router;
