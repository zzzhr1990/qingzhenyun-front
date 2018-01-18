var express = require('express')
// var path = require('path')
// var favicon = require('serve-favicon')
var helmet = require('helmet')
var logger = require('morgan')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
let ApiException = require('./app/exception/api_exception')
//let session = require('express-session');
//let RedisStore = require('connect-redis')(session);
let jwt = require('express-jwt')
const Constants = require('./app/const/constants')
var app = express()

// session..
/*
app.use(session({
    store: new RedisStore({ 'host': '172.18.130.158', 'port': '6396' }),
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}));
*/
app.use(jwt({
    secret: Constants.JWT_SECRET_KEY, 'getToken': (req) => {
        /*
        var parts = req.headers.authorization.split(' ');
        if (parts.length == 2) {
            var scheme = parts[0];
            var credentials = parts[1];

            if (/^Bearer$/i.test(scheme)) {
                return token;
            }
        } else {
            return undefined
        }
        */
        if (req.headers.authorization) {
            return req.headers.authorization
        }
        if (req.query && req.query.token) {
            return req.query.token;
        }
        return null
    }
})
    .unless({ path: ['/v1/user/login', '/v1/user/register', '/v1/user/check', '/v1/user/logout'] }))
// common config
app.use(logger('dev'))
app.use(cookieParser())
app.use(helmet())
// parser json to object
// app.use(bodyParser.text())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// controller
app.use('/v1', require('./app/web/controllers'))

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new ApiException('Recource not found.', 404, 'RESOURCE_NOT_FOUND')
    next(err)
})

// error handler
app.use(function (err, req, res, next) {
    if (!err["supress"]) {
        console.error(err.stack)
    }
    let status = err.status || 500
    res.status(status)
    let data = { success: false, message: err.message }
    if (err['code']) {
        data.code = err["code"]
    } else {
        data.code = 'INTERNAL_SERVER_ERROR'
    }
    data.status = status
    res.json(data)
})

module.exports = app
