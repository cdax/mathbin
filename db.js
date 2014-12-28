/*
 * db.js
 * All DB abstractions go here
 *
 */
var
    config      = require('./config'),
    mongoose    = require('mongoose');

module.exports = mongoose.connect(
    'mongodb://' + config.mongo.user + 
    ':' + config.mongo.pwd + 
    '@' + config.mongo.host + 
    ':' + config.mongo.port +
    '/' + config.mongo.db
);