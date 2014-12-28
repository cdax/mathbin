/*
 * /routers/api/index.js
 * Router mountpoint: /api
 * All API routes begin here
 *
 */
var
    express     = require('express'),
    snippet     = require('./snippet'),
    router      = express.Router();

router.use('/snippet', snippet);

module.exports = router;