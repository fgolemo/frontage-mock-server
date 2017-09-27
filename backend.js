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
    res.json({error: 0, on: facade.is_on});
});

backend.post("/admin/is_on", function (req, res) {
    console.log("turning facade " + (req.body.on ? "on" : "off"));
    facade.is_on = (req.body.on);
    res.json({error: 0, on: facade.is_on});
});

backend.get("/admin/cal", function (req, res) {
    setTimeout(function () {
        res.json({
            error: 0,
            on: "20:00",
            off: "23:30",
            default: "flag",
            params: {"country": "FR", "brightness": 50}
        });
    }, 1000);
});

backend.post("/admin/cal", function (req, res) {
    //TODO
    res.json({error: 0});
});

backend.get("/admin/apps", function (req, res) {
    res.json({
        error: 0,
        data: [
            {
                "name": "flag",
                "params": [
                    {name: "country", desc: "ISO 3166-1 country code, 2 letters"},
                    {name: "brightness", desc: "Brightness level of the flag, range 0-100"}
                ]
            },
            {
                "name": "emoji",
                "params": [
                    {name: "emoji", desc: "Typed emoji, like :) or :'("}
                ]
            }
        ]
    });
});

var current_date = new Date();
// current_date.setMinutes(current_date.getMinutes() - 5);

var current_app = {
    name: "flag",
    params: {"country": "FR", "brightness": 50},
    start: current_date,
    user: "cal"
};

backend.get("/admin/apps/running", function (req, res) {
    setTimeout(function () {
        if (facade.is_on) {
            res.json({error: 0, data: current_app});
        } else {
            res.json({error: 0, data: empty_app});
        }
    }, 1500);
});

backend.put("/admin/apps/running", function (req, res) {
    console.log("got app launch:");
    console.log(req.body);
    current_app.name = req.body.name;
    current_app.params = req.body.params;
    current_app.start = new Date();
    current_app.user = "root";
    res.json({error: 0, data: current_app});
});

var empty_app = {
    name: "",
    params: {},
    start: "",
    user: ""
};

backend.delete("/admin/apps/running", function (req, res) {
    current_app = JSON.parse(JSON.stringify(empty_app));
    res.json({error: 0, data: current_app});
});

// backend.get("", function (req, res) {
//
// });

module.exports = backend;