var express = require('express');
var app = express();
var path = require('path');
var fs = require('fs');
var https = require('https');

app.use('/assets', express.static(__dirname + '/assets'));

app.get(/^(?:(?!assets).)*$/, function (req, res) {
    if(req.url.indexOf('/assets/') === -1) {
        res.sendFile(path.join(__dirname + '/index.html'));
    }
});

https.createServer({
    key: fs.readFileSync(__dirname + '/assets/key.pem'),
    cert: fs.readFileSync(__dirname + '/assets/cert.pem')
}, app).listen(8080);