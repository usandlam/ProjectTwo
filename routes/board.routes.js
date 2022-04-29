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
        if(!req.session.passport)
            req.flash('info','Boards submitted by non-users are subject to review.')

        // const newTag = await Tag.create({label:'PiHat'})
        const featEnum = Board.schema.path('features').options.enum;

        const tagList = await Tag.find();
        res.render("boards/new",{tags: tagList, features: featEnum, flash: req.flash('info')});
    }catch (err){
        console.log(err);
    }
});



router.post("/create", async (req, res, next) => {
    const {name,author,tag,description,url,topSVG,bottomSVG,altTags,features} = req.body;
    let createdBy = '';
    if(!req.session.passport){
        createdBy = '';
    }else{
        createdBy = req.session.passport.user;
    }

    console.log(req.session.passport.user);

    const submission = {
        name: req.body.name,
        author: req.body.author,      
        tag: req.body.tag,
        postedBy: createdBy,
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
        // return res.render();
    }catch(err){
        res.render("boards/new", { attempt: {name,author,tag,description,url,topSVG,bottomSVG,altTags,features}, tags: tagList });
        console.log(err);
    }
    res.redirect("/boards");
    // res.render("boards/new", { attempt: {name,author,tag,description,url,topSVG,bottomSVG,altTags,features}, tags: tagList });
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

router.get("/boards/search", async (req, res, next) => {
    const label = req.query.q;
    const query = { label };
    try{
        const tagFilter = await Tag.findOne(query).setOptions({ sanitizeFilter: true });
        if(tagFilter == null){
            req.flash('info','Sorry, no boards of this type yet :( - why not submit one!? Click here to go back.')
            return res.render("list",{boardList: '', flash: req.flash('info')});
        }
        const boards = await Board.find({ 'tag' : tagFilter._id }).populate("tag");
        if(boards.length == 0 ){
            req.flash('info','Sorry, no boards of this type yet :( - why not submit one!? Click here to go back.')
        }
        res.render("list",{boardList: boards, flash: req.flash('info')});
    }catch (err){
        console.log(err);
    }
});

router.get("/boards/:t", async (req, res, next) => {
    const label = req.params.t;
    const query = { label };
    try{
        const tagFilter = await Tag.findOne(query).setOptions({ sanitizeFilter: true });
        if(tagFilter == null){
            req.flash('info','Sorry, no boards of this type yet :( - why not submit one!? Click here to go back.')
            return res.render("list",{boardList: '', flash: req.flash('info')});
        }
        const boards = await Board.find({ 'tag' : tagFilter._id }).populate("tag");
        if(boards.length == 0 ){
            req.flash('info','Sorry, no boards of this type yet :( - why not submit one!? Click here to go back.')
        }
        // const boards = await Board.find().populate("tag");
        res.render("list",{boardList: boards, flash: req.flash('info')});
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

router.get("/board/:id/edit", control(), async (req, res, next) => {
    const id = req.params.id;
    const tagList = await Tag.find();
    try{
        const board = await Board.findById(id).populate('tag');

        featEnum = Board.schema.path('features').options.enum;
        
        tagList.map(t => { if(t.label == board.tag.label){t.selected = 'true'} })
        const featUI = featEnum.map(v=>{ let checked = ''; if(board.features.includes(v)){ checked = 'checked'} return({label:v,checked}) });
        
        res.render("boards/edit",{tags: tagList, flash: req.flash('info'), boardInfo: board, features: featUI});
    }catch (err){
        console.log(err);
    }
});

router.post("/board/:id/edit", async (req, res, next) => {
    const id = req.params.id;
    const updSubmission = {
        name: req.body.name ,
        author: req.body.author,
        tag: req.body.tag,
        postedBy: req.session.passport.user,
        altTag: req.body.altTags.split(','),
        description: req.body.description,
        url: req.body.url,
        features: req.body.features
    };
    console.log(updSubmission);
    try{
        const board = await Board.findByIdAndUpdate(id,updSubmission);
        res.redirect("/boards");
    }catch (err){
        console.log(err);
    }
});


router.post("/board/:id/delete",control(),async (req, res, next) => {
    const id = req.params.id;
    try{
        const deleteBoard = await Board.findByIdAndRemove(id);
        res.redirect("/boards");
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
