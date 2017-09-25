var express = require('express');
var app = express();
var backend = require("./backend");
var jwt    = require('jsonwebtoken');
var bodyParser  = require('body-parser');

var port = (process.env.PORT || 5000);


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set('port', port);
app.set('superSecret', "superSecret123");

app.get('/', function(req, res) {
    res.send('Hello! The API is at http://localhost:' + port + '/api');
});

app.post("/b/login", function (req, res) {
    console.log(req.body);
    console.log("user:",req.body.username);
    console.log("pass:",req.body.password);

    var token = jwt.sign({username: req.body.username}, app.get('superSecret'), {
        expiresIn: "1d" // expires in 24 hours
    });

    res.json({
        error: 0,
        token: token
    });

});

app.use("/b", backend);


app.listen(port, function() {
  console.log('Node app is running on port', port);
});
