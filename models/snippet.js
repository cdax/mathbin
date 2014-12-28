var
    db          = require('../db'),
    crypto      = require('crypto'),
    Promise     = require('q'),
    Schema      = db.Schema;

var snippetSchema = new Schema({
    shortCode: {
        type:       String,
        required:   true,
        index:      true    //snippets will be queried by shortCode quite often
    },
    title:      String,
    code: {
        type:       String,
        required:   true
    },
    //This field allows random picking of snippets
    random: {
        type:       Number,
        default:    Math.random,
        required:   true
    },
    meta: {
        views: {
            type:       Number,
            default:    0
        },    
        createDate: {
            type:       Date,
            default:    Date.now
        },
        updateDate: {
            type:       Date,
            default:    Date.now
        }
    }
});

var Snippet = db.model('Snippet', snippetSchema);

//Validation for an empty string on Snippet.code
Snippet.schema.path('code').validate(function(value) {
    return value.trim() !== '';
}, 'Empty code.');

//Return the compiled model
module.exports = Snippet;

var generateShortCode = module.exports.generateShortCode = function() {
    return Promise.nfcall(crypto.randomBytes, 8).then(function(buf) {
            return buf.toString('base64').replace(/\//g, '_').replace(/\+/g, '-');
        }).then(function(shortCode) {
            return [shortCode, Snippet.findOne({
                shortCode: shortCode
            }).exec()];    
        }).spread(function(shortCode, snippet) {
            if(snippet === null) {
                return shortCode;
            }
            else {
                return generateShortCode();
            }
        });
}