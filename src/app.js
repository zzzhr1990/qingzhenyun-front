var express = require('express')
// var path = require('path')
var helmet = require('helmet')
var logger = require('morgan')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
let ApiException = require('./app/exception/api_exception')
const RequestUtil = require('./app/util/request_util')
//let session = require('express-session');
//let RedisStore = require('connect-redis')(session);
let jwt = require('express-jwt')
const Constants = require('./app/const/constants')
const rpc = require('./app/const/rpc')
const CommonRpc = require('./app/service/common_rpc')
/** INIT RPCs **/
const ice = require('ice').Ice
const communicator = ice.initialize(process.argv)
rpc.cloudStoreRpc = new CommonRpc(communicator, 'CloudStoreServiceHandler', require('./app/ice/cloudstore')
    .store.CloudStoreServiceHandlerPrx)
rpc.userFileRpc = new CommonRpc(communicator, 'UserFileServiceHandler', require('./app/ice/userfile')
    .userfile.UserFileServiceHandlerPrx)
rpc.userRpc = new CommonRpc(communicator, 'UserServiceHandler', require('./app/ice/userservice')
    .user.UserServiceHandlerPrx)
//OfflineDownloadServiceHandler
rpc.offlineRpc = new CommonRpc(communicator, 'OfflineDownloadServiceHandler', require('./app/ice/offline')
    .offline.OfflineDownloadServiceHandlerPrx)
/** INIT RPCs **/
const app = express()
const ResponseUtil = require('./app/util/response_util')
const logger4j = require('log4js').getLogger('app.js')
logger4j.level = 'info'
// session..
/*
app.use(session({
    store: new RedisStore({ 'host': '172.18.130.158', 'port': '6396' }),
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}));
*/
app.use(
    jwt({
        secret: Constants.JWT_SECRET_KEY,
        'getToken': (req) => {
            let data = RequestUtil.getToken(req)
            if(data){
                logger4j.info('Token %s',data)
                logger4j.info('Get UA %s',req.headers['user-agent'])
            }
            return data
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
            //logger4j.info('Get token %s',req.query.token)
            //logger4j.info('Get UA %s',req.headers['user-agent'])
            // logger4j.info('', )
            
            /*
            if (req.headers.Authorization) {
                return req.headers.Authorization
            }
            if (req.query && req.query.authorization) {
                return req.query.authorization;
            }
            */
            
        }
    }).unless({
        path: ['/v1/user/login',
            '/v1/user/register',
            '/v1/user/check',
            '/v1/user/logout',
            '/v1/user/sendRegisterMessage',
            '/v1/user/loginByMessage',
            '/v1/user/sendLoginMessage',
            '/v1/user/sendChangePasswordMessage2',
            '/v1/user/changePasswordByMessage2',
            '/v1/store/callback/wcs',
            /^\/v1\/store\/callback\/wcsm3u8\/.*/,
            '/v1/store/callback/wcsm3u8',
            '/v1/store/play',
            /^\/v1\/store\/play\/.*/
        ]
    })
)
// common config
app.use(logger('dev'))
app.use(cookieParser())
app.use(helmet())

app.use('/v1/store/callback/wcsm3u8', bodyParser.text())
app.use(/^\/v1\/store\/callback\/wcsm3u8\/.*/, bodyParser.text())
//app.use('/v1/store/callback/wcsm3u8',bodyParser.raw());

// parser json to object
// app.use(bodyParser.text())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: false
}))
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

// controller
app.use('/v1', require('./app/web/controllers'))

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new ApiException('Recource not found.', 404, 'RESOURCE_NOT_FOUND')
    next(err)
})

// error handler
app.use(function (err, req, res, next) {
    if (!err['supress'] && err.name !== 'UnauthorizedError') {
        logger4j.error(err.stack)
    }
    let status = err.status || 500
    res.status(status)
    let data = {
        success: false,
        message: err.message
    }
    if (err['code']) {
        data.code = err['code']
    } else {
        data.code = 'INTERNAL_SERVER_ERROR'
    }
    data.status = status
    ResponseUtil.json(req, res, data)
})

module.exports = app