var express = require('express');

var backend = express.Router();

backend.get("/test", function (request, response) {
    response.json({"abc":123});
});

module.exports = backend;