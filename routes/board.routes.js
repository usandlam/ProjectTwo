const router = require("express").Router();

const control = require('../middleware/mustBeLoggedIn.js');

const Board = require('../models/Board.model');
const Tag = require('../models/Tag.model');

/* GET home page */
router.get("/new", control(),(req, res, next) => {
  res.render("boards/new");
});

router.get("/create", async (req, res, next) => {
    try{
        // if(!req.session.passport)
            // req.flash('info','fart')
        // const newTag = await Tag.create({label:'IO'})
        const tagList = await Tag.find();
        res.render("boards/new",{tags: tagList, flash: req.flash('info')});
    }catch (err){
        console.log(err);
    }
});



router.post("/create", async (req, res, next) => {
    const {name,author,tag,description,url,topSVG,bottomSVG,altTags,features} = req.body;
    const tagsIn = { altTag: altTags.split(',')};
    const submission = {
        name: req.body.name ,
        author: req.body.author,      
        tag: req.body.tag,
        altTag: req.body.altTags.split(','),
        topSVG: req.body.topSVG,
        bottomSVG: req.body.bottomSVG,
        description: req.body.description,
        url: req.body.url,
        features: req.body.features
    };
    const tagList = await Tag.find();
    try{
        // const newBoard = await Board.create({name,tag,author,description,url,topSVG,bottomSVG,tagsIn,features});
        const newBoard = await Board.create(submission);
    }catch(err){
        res.render("boards/new", { attempt: {name,author,tag,description,url,topSVG,bottomSVG,altTags,features}, tags: tagList });
        console.log(err);
    }
    // res.redirect("/boards");
    res.render("boards/new", { attempt: {name,author,tag,description,url,topSVG,bottomSVG,altTags,features}, tags: tagList });
});

router.get("/image/:id/top.svg", async (req, res, next) => {
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

router.get("/image/:id/bottom.svg", async (req, res, next) => {
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

router.get("/boards", async (req, res, next) => {
    try{
        const boards = await Board.find().populate("tag");
        res.render("list",{boardList: boards});
    }catch (err){
        console.log(err);
    }
});

router.get("/list-mini", async (req, res, next) => {
    try{
        const boards = await Board.find().populate("tag");
        res.render("light-list",{boardList: boards});
    }catch (err){
        console.log(err);
    }
});

router.get("/list/:q", async (req, res, next) => {
    const q = req.params.q;
    try{
        const boards = await Board.find({altTag: { $eq : q } });
        res.render("list",{boardList: boards});
    }catch (err){
        console.log(err);
    }
});
                        //control(),
router.get("/board/:id/edit",  async (req, res, next) => {
    const id = req.params.id;
    const tagList = await Tag.find();
    try{
        const board = await Board.findById(id);
        res.render("boards/edit",{tags: tagList, flash: req.flash('info'), boardInfo: board});
    }catch (err){
        console.log(err);
    }
});

router.post("/board/:id/edit", async (req, res, next) => {
    const id = req.params.id;
    console.log(req.body.name);    
    console.log(req.body.features);    
    console.log(req.file);    
    // try{
    //     const board = await Board.findById(id);
        res.render("boards/edit");
    // }catch (err){
    //     console.log(err);
    // }
});


router.post("/board/:id/delete",control(),async (req, res, next) => {
    const id = req.params.id;
    try{
        const deleteBoard = await Board.findByIdAndRemove(id);
        res.redirect("/list");
    }catch (err){
        console.log(err);
    }
});


router.get("/board/:id", async (req, res, next) => {
    const id = req.params.id;
    try{
        const board = await Board.findById(id).populate("tag");
        res.render("boards/details",{userSession: req.session.passport, boardInfo: board});
    }catch (err){
        console.log(err);
    }
});

//res.render('auth/login', { flash: req.flash('error') });

module.exports = router;
