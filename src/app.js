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
const rpc = require('./app/const/rpc')
const CommonRpc = require('./app/service/common_rpc')
/** INIT RPCs **/
const ice = require('ice').Ice
const communicator = ice.initialize(process.argv)
rpc.cloudStoreRpc = new CommonRpc(communicator, "CloudStoreServiceHandler", require('./app/ice/cloudstore')
    .store.CloudStoreServiceHandlerPrx)
rpc.userFileRpc = new CommonRpc(communicator, "UserFileServiceHandler", require('./app/ice/userfile')
    .userfile.UserFileServiceHandlerPrx)
rpc.userRpc = new CommonRpc(communicator, "UserServiceHandler", require('./app/ice/userservice')
    .user.UserServiceHandlerPrx)
/** INIT RPCs **/
var app = express()
const ResponseUtil = require('./app/util/response_util')

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
        var pre = req.headers.authorization ? req.headers.authorization : (req.headers.Authorization ? req.headers.Authorization : undefined)
        if (pre) {
            let parts = pre.split(' ');
            if (parts.length == 2) {
                var scheme = parts[0];
                var credentials = parts[1];

                if (/^Bearer$/i.test(scheme)) {
                    return credentials;
                } else {
                    throw new ApiException('Format is Authorization: Bearer [token]', 401, "BEARER_AUTHORIZATION_HEADER_INVALID")
                }
            } else {
                return undefined
            }
            return pre
        }
        /*
        if (req.headers.Authorization) {
            return req.headers.Authorization
        }
        if (req.query && req.query.authorization) {
            return req.query.authorization;
        }
        */
        if (req.query && req.query.auth) {
            return req.query.auth;
        }
        if (req.query && req.query.token) {
            return req.query.token;
        }
        return null
    }
})
    .unless(
    {
        path:
            ['/v1/user/login',
                '/v1/user/register',
                '/v1/user/check',
                '/v1/user/logout',
                '/v1/store/callback/wcs',
                '/v1/store/callback/wcsm3u8'
            ]
    }
    )
)
// common config
app.use(logger('dev'))
app.use(cookieParser())
app.use(helmet())



// parser json to object
// app.use(bodyParser.text())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
const USER_VERSION = 1
app.use((req, res, next) => {
    if (req.user) {
        if (req.user.version != USER_VERSION) {
            var err = new ApiException('User JWT version not match. please login again', 401, 'USER_VERSION_NOT_MATCH')
            //console.log(req.user)
            next(err)
        } else {
            next()
        }
    } else {
        next()
    }

})
app.use('/v1/store/callback/wcsm3u8', (req, res, next) => {
    var data = '';
    //req.setEncoding('utf8');
    req.on('data', (chunk)=>{
        console.log("chunk")
    })
    req.on('end', data => {
        console.log("OM")
        next()
    }
    )
});
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
    ResponseUtil.json(req, res, data)
})

module.exports = app
