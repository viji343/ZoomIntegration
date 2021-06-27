var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');

var app = express();
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.raw({ limit: '1mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

// uncomment after placing your favicon in /public
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

/* Routes */
app.get('/', function (req, res) {
    res.json({ message: 'Express is up!' });
});
app.use('/api', require('./routes/api'));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    res.status(404).send({ message: 'Requested Url Not Found.' });
    //next(err);
});

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    console.log(err);
    res.status(err.status || 500);
});


module.exports = app;
