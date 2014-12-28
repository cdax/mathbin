/* 
 * /router/api/snippet.js
 * Router mountpoint: /api/snippet
 * All API routes for the snippet object are defined here 
 *
 */
var
    express     = require('express'),
    Promise     = require('q'),
    _           = require('underscore'),
    Snippet     = require('../../models/snippet'),
    router      = express.Router();

//Array of object keys that should be sent back to the user
var whitelistedKeys = [
    'shortCode',
    'title',
    'code'
];

//Get a snippet
router.get('/:id', function(req, res) {
    //Lookup the database
    Snippet.findOne({
        shortCode: req.params.id
    }).exec()
    //As soon as the snippet is found in the DB, send it back
    .then(function(snippet) {
        //If the snippet was not found, 404
        if(snippet === null) {
            res.redirect('/404.html');
        } else {
            console.log('FOUND');
            console.log(_.pick(snippet, whitelistedKeys));
            res.status(200).send(_.pick(snippet, whitelistedKeys));
            //return Promise.ninvoke(res, 'send', _.pick(snippet, whitelistedKeys));
        }
    }, console.log)
    //Bubble up any uncaught exceptions
    .end();
});

//Get a random snippet
router.get('/', function(req, res) {
    //Get a random snippet
    var pivot = Math.random();
    Snippet.findOne().gte('random', pivot).exec()
        .then(function(snippet) {
            if(snippet === null) {
                return Snippet.findOne().lt('random', pivot).exec();
            } else {
                res.status(200).send(_.pick(snippet, whitelistedKeys));
                return true;
            }
        }).then(function(snippet) {
            if(snippet === true) {
                return true;
            } else if(snippet === null) {
                return new Snippet;
            } else {
                res.status(200).send(_.pick(snippet, whitelistedKeys));
                return true;
            }
        }).then(function(snippet) {
            if(snippet === true) {
                return true;
            } else {
                res.status(200).send(_.pick(snippet, whitelistedKeys));
            }
        }).end();
});

//Save a new snippet
router.post('/', function(req, res) {
    //Create the new snippet object
    var newSnippet = new Snippet({
        title: req.body.title,
        code: req.body.code
    }); 
    
    Snippet.generateShortCode()
    .then(function(shortCode) {
        newSnippet.shortCode = shortCode;
        return Snippet.create(newSnippet);
    })
    .then(function(snippet) {
        res.status(200).send(snippet);  
    })
    .done();
});

module.exports = router;