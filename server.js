#!/bin/env node
var express = require('express');
var http = require('http');
var app = express();
var ParseServer = require('parse-server').ParseServer;
var host = process.env.OPENSHIFT_NODEJS_IP || 'localhost';
var port = process.env.OPENSHIFT_NODEJS_PORT || 3000;
var databaseUri = process.env.MONGODB_URL || 'mongodb://localhost:27017/';

var api = new ParseServer({
    databaseURI: databaseUri + 'dev',
    cloud: __dirname + '/cloud/main.js',
    appId: process.env.PARSE_APP_ID || 'myAppId',
    masterKey: process.env.PARSE_MASTER_KEY || 'mySecretMasterKey'
});

app.use('/parse', api);

app.get('/', (req, res) => {
    res.status(200).send('Working');
});

http.createServer(app).listen(port, host, () => {
    console.log('%s: Node server started on %s:%d ...', Date(Date.now() ), host, port);
});
