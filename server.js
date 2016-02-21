var express = require('express');
var app = express();
var path = require('path');
var fs = require('fs');
var https = require('https');
var request = require('request');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";


app.use('/assets', express.static(__dirname + '/assets'));

app.get(/^(?:(?!assets|proxy).)*$/, function (req, res) {
    if(req.url.indexOf('/assets/') === -1) {
        res.sendFile(path.join(__dirname + '/index.html'));
    }
});

app.use('/proxy/', function(req, res) {
    try {
        var url = req.url.slice(1);
        req.pipe(request(url)).pipe(res);
    } catch(e) {
        res.send(200);
    }
});

https.createServer({
    key: fs.readFileSync(__dirname + '/assets/key.pem'),
    cert: fs.readFileSync(__dirname + '/assets/cert.pem')
}, app).listen(8080);