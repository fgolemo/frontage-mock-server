var express = require('express');
var app = express();
var jwt    = require('jsonwebtoken');

var backend = express.Router();

backend.use(function(req, res, next) {

    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    // decode token
    if (token) {

        // verifies secret and checks exp
        jwt.verify(token, app.get('superSecret'), function(err, decoded) {
            // if (err) {
            //     return res.json({ error: 100, message: 'Failed to authenticate token.' });
            // } else {
            //     // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                next();
            // }
        });

    } else {

        // if there is no token
        // return an error
        return res.status(403).send({
            error: 300
            // message: 'No token provided.'
        });

    }
});

backend.get("/test", function (request, response) {
    response.json({"abc":123});
});


module.exports = backend;