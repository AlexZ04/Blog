const express = require('express');

const app = express();

app.get('/', function(req, res) {
    res.sendfile('index.html');
});

app.get('/login', function(req, res) {
    res.sendfile('./src/login/login.html');
});

app.listen(3000);
