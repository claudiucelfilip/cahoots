var express = require('express');
var app = express();
var path = require('path');

app.use('/assets', express.static(__dirname + '/assets'));

app.get(/^(?:(?!assets).)*$/, function (req, res) {
    if(req.url.indexOf('/assets/') === -1) {
        res.sendFile(path.join(__dirname + '/index.html'));
    }
});

app.listen(8080, function () {
    console.log('Example app listening on port 3000!');
});