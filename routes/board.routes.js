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
        // const newTag = await Tag.create({label:'LED'})
        const tagList = await Tag.find();
        res.render("boards/new",{userSession: req.session.passport, tags: tagList});
    }catch (err){
        console.log(err);
    }
});

router.post("/create", async (req, res, next) => {
    console.log(req.body);
    const {name,author,tag,description,url,topSVG,bottomSVG,altTag,features} = req.body;
    const tagList = await Tag.find();
    try{
        const newBoard = await Board.create({name,tag,author,description,url,topSVG,bottomSVG,altTag,features});
    }catch(err){
        res.render("boards/new", { attempt: {name,author,tag,description,url,topSVG,bottomSVG,altTag}, tags: tagList });
        console.log(err);
    }
    // res.redirect("/boards");
    res.render("boards/new", { attempt: {name,author,tag,description,url,topSVG,bottomSVG,altTag}, tags: tagList });
});

router.get("/image/:id/top", async (req, res, next) => {
    const id = req.params.id;
    try{
        const image = await Board.findById(id);
        res.setHeader('Content-Type', 'image/svg+xml');
        res.send(image.topSVG);
        // res.render("boards/new",{userSession: req.session.passport, tags: tagList});
    }catch (err){
        console.log(err);
    }
});

router.get("/image/:id/bottom", async (req, res, next) => {
    const id = req.params.id;
    try{
        const image = await Board.findById(id);
        res.setHeader('Content-Type', 'image/svg+xml');
        res.send(image.bottomSVG);
        // res.render("boards/new",{userSession: req.session.passport, tags: tagList});
    }catch (err){
        console.log(err);
    }
});

router.get("/list", async (req, res, next) => {
    try{
        const boards = await Board.find();
        res.render("list",{userSession: req.session.passport, boardList: boards});
    }catch (err){
        console.log(err);
    }
});

router.get("/list/:q", async (req, res, next) => {
    const q = req.params.q;
    try{
        const boards = await Board.find({altTag: { $eq : q } });
        res.render("list",{userSession: req.session.passport, boardList: boards});
    }catch (err){
        console.log(err);
    }
});

router.get("/board/:id/edit", async (req, res, next) => {
    const id = req.params.id;
    try{
        const board = await Board.findById(id);
        res.render("boards/details",{userSession: req.session.passport, boardInfo: board});
    }catch (err){
        console.log(err);
    }
});


router.get("/board/:id/delete", async (req, res, next) => {
    const id = req.params.id;
    try{
        const board = await Board.findById(id);
        res.render("boards/details",{userSession: req.session.passport, boardInfo: board});
    }catch (err){
        console.log(err);
    }
});


router.get("/board/:id", async (req, res, next) => {
    const id = req.params.id;
    try{
        const board = await Board.findById(id);
        res.render("boards/details",{userSession: req.session.passport, boardInfo: board});
    }catch (err){
        console.log(err);
    }
});



//res.render('auth/login', { flash: req.flash('error') });

module.exports = router;
