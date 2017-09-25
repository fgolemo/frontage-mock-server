var express = require('express');
var app = express();
var jwt = require('jsonwebtoken');

var backend = express.Router();

backend.use(function (req, res, next) {

    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    // decode token
    if (token) {

        // verifies secret and checks exp
        jwt.verify(token, app.get('superSecret'), function (err, decoded) {
            // // in a production environment, actually check the token.
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
        return res.status(403).send({
            error: 300
        });

    }
});

backend.get("/test", function (request, response) {
    response.json({"abc": 123});
});

var facade = {
    is_on: false
};

backend.get("/admin/is_on", function (req, res) {
    res.json({on: facade.is_on});
});

backend.post("/admin/is_on", function (req, res) {
    facade.is_on = bool.valueOf(req.body.on);
    res.json({error: 0});
});

backend.get("/admin/cal", function (req, res) {
    res.json({
        on: "20:00",
        off: "23:30",
        default: "flag",
        params: {"country": "FR", "brightness": 50}
    });
});

backend.post("/admin/cal", function (req, res) {
    //TODO
    res.json({error: 0});
});

backend.get("/admin/apps", function (req, res) {
    res.json({
        "apps": [
            {
                "name": "flag",
                "params": {
                    "country": "ISO 3166-1 country code, 2 letters",
                    "brightness": "Brightness level of the flag, range 0-100"
                }
            },
            {
                "name": "emoji",
                "params": {
                    "emoji": "Typed emoji, like :) or :'("
                }
            }
        ]
    });
});

var app = {
    name: "flag",
    params: {"country": "FR", "brightness": 50},
    start: "2017-08-22T20:00:00+01:00",
    user: "cal"
};

backend.get("/admin/apps/running", function (req, res) {
    res.json(app);
});

backend.put("/admin/apps/running", function (req, res) {
    app.name = req.body.name;
    app.params = req.body.params;
    app.start = req.body.start;
    app.user = req.body.user;
    res.json({error: 0});
});

backend.get("/admin/apps/running", function (req, res) {
    app = {
        name: "",
        params: {},
        start: "",
        user: ""
    };
    res.json({error: 0});
});

// backend.get("", function (req, res) {
//
// });

module.exports = backend;