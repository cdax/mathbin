var
    path        = require('path'),
    Promise     = require('q'),
    express     = require('express'),
    compression = require('compression'),
    logger      = require('morgan'),
    bodyParser  = require('body-parser'),
    routers     = require('./routers'),
    config      = require('./config'),
    app         = express();

app.set('env', 'development');

//Log everything
//TODO: Customize logging
app.use(logger('dev'));

//Compress compressibles before serving
app.use(compression({
    //Compress files over 512k
    threshold: 512
}));

//Parse application/json
app.use(bodyParser.json());

app.use('/', routers);

//Serve files from the /app folder
app.use(express.static(path.join(__dirname, '/app')));

if(!module.parent) {
    //If the port value is configured in an environment variable, choose that
    app.listen(process.env.port || config.server.port);
}

module.exports = app;