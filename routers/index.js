/*
 * /routers/index.js
 * Router mountpoint: /
 * All routes begin here
 *
 */
var
    express     = require('express'),
    api         = require('./api'),
    router      = express.Router();

router.use('/api', api);

module.exports = router;