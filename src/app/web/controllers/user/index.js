let express = require('express')
let router = express.Router()
let ApiException = require('../../../exception/api_exception')
let ApiValidateException = require('../../../exception/api_validate_exception')
let ResponseUtil = require('../../../util/response_util')
let StringUtil = require('../../../util/string_util')
let UserServiceRpc = require('../../../service/user_service')
//let demoService = require('../../../service/demo_service')
//var grpc = require('grpc')
let validator = require('validator')
let userService = new UserServiceRpc()
let jwt = require('jsonwebtoken')
const Constants = require('../../../const/constants')


router.post('/register', (req, res) => {
    let name = req.body['name']
    if (StringUtil.isEmpty(name)) {
        throw new ApiValidateException("User name required", '{NAME}_REQUIRED')
    }
    let password = req.body['password']
    if (StringUtil.isEmpty(password)) {
        throw new ApiValidateException("User password required", '{PASSWORD}_REQUIRED')
    }
    let email = req.body['email']
    if (StringUtil.isEmpty(email)) {
        throw new ApiValidateException("User email required", '{EMAIL}_REQUIRED')
    }
    if (!validator.isEmail(email)) {
        throw new ApiValidateException("User email not validate", '{EMAIL}_NOT_VALIDATE')
    }
    let phone = req.body['phone']
    if (StringUtil.isEmpty(phone)) {
        throw new ApiValidateException("User phone required", '{PHONE}_REQUIRED')
    }
    if (!validator.isMobilePhone(phone, 'any')) {
        throw new ApiValidateException("User phone not validate", '{PHONE}_NOT_VALIDATE')
    }
    // Do Register RPC
    let ip = req.headers['x-real-ip'] || req.connection.remoteAddress;
    userService.caller.registerUser(name, password, email, phone, ip)
        .then((result) => ResponseUtil.Ok(req, res, result))
        .catch((error) => {
            //console.log(error)
            if (error['innerCode']) {
                ResponseUtil.ApiError(req, res, new ApiException(error['innerMessage'], 400, error['innerMessage']))
            } else {
                ResponseUtil.Error(req, res, error)
            }
        })

    /*
    { RegisterNotSuccessException: USER_NAME_EXIST
at UserService_registerUser_result.read (C:\Users\zzzhr\Documents\vscode\qingzhenyun-front\src\app\thrift\UserService.js:180:19)
at exports.Client.UserServiceClient.recv_registerUser (C:\Users\zzzhr\Documents\vscode\qingzhenyun-front\src\app\thrift\UserService.js:264:10)
at C:\Users\zzzhr\Documents\vscode\qingzhenyun-front\node_modules\thrift\lib\nodejs\lib\thrift\connection.js:139:41
at Socket.<anonymous> (C:\Users\zzzhr\Documents\vscode\qingzhenyun-front\node_modules\thrift\lib\nodejs\lib\thrift\framed_transport.js:60:7)
at Socket.emit (events.js:159:13)
at addChunk (_stream_readable.js:265:12)
at readableAddChunk (_stream_readable.js:252:11)
at Socket.Readable.push (_stream_readable.js:209:10)
at TCP.onread (net.js:608:20)
name: 'RegisterNotSuccessException',
message: 'USER_NAME_EXIST',
errorCode: 101 }
need
    */
    //TODO:need check

})

router.post('/login', (req, res) => {
    // login logic
    let value = req.body['value']
    let password = req.body['password']
    if (StringUtil.isEmpty(value)) {
        throw new ApiValidateException("Check value required", '{VALUE}_REQUIRED')
    }
    if (StringUtil.isEmpty(password)) {
        throw new ApiValidateException("User password required", '{PASSWORD}_REQUIRED')
    }
    /*
    userService.caller.checkUserValidByEmail('a','b').then(data => { console.log(data) }).catch(err => {console.log(err)})
    */
    // userService.caller
    // Check email first.

    var caller = undefined
    if (validator.isEmail(value)) {
        caller = userService.caller.checkUserValidByEmail(value, password)
    } else if (validator.isMobilePhone(value, 'any')) {
        caller = userService.caller.checkUserValidByPhone(value, password)
    } else {
        caller = userService.caller.checkUserValidByName(value, password)
    }

    // Access
    caller.then(dat => {
        //ResponseUtil.Error(req, res, error)
        req.user = {
            'uuid': dat.uuid,
            'name': dat.name,
            'email': dat.email,
            'phone': dat.phone,
            'lastLoginTime': dat.lastLoginTime,
            'refreshTime': dat.refreshTime
        }
        ResponseUtil.Ok(req, res, dat)
    }).catch(error => {
        if (error['innerCode']) {
            ResponseUtil.ApiError(req, res, new ApiException(error['innerMessage'], 401, "LOGIN_FAILED"))
        } else {
            ResponseUtil.Error(req, res, error)
        }
    })
})

router.post('/check', (req, res) => {
    let value = req.body['value']
    if (StringUtil.isEmpty(value)) {
        throw new ApiValidateException("Check value required", '{VALUE}_REQUIRED')
    }
    let type = (req.body['type'] ? req.body['type'] : 0).toString()
    // check
    switch (type) {
        case "0":
            userService.caller.checkUserExistsByName(value)
                .then((data) => ResponseUtil.Ok(req, res, data))
                .catch((error) => ResponseUtil.OkOrError(req, res, error))
            break;
        case "1":
            userService.caller.checkUserExistsByEmail(value)
                .then(data => ResponseUtil.Ok(req, res, data))
                .catch((error) => ResponseUtil.OkOrError(req, res, error))
            break;
        case "2":
            userService.caller.checkUserExistsByPhone(value)
                .then(data => ResponseUtil.OkOrError(req, res, error, data))
                .catch((error) => ResponseUtil.OkOrError(req, res, error))
            break;
        default:
            throw new ApiValidateException("Check type not validate", '{TYPE}_NOT_RECONGNISED')
    }
})


router.post('/benchmark', (req, res) => {

    // Do Register RPC

    let startTime = new Date().getTime();
    let max = 500000
    /*
    bench = (i) => demoService.out.execute('a', 'b').then((data) => {
        //
        if (i < max) {
            //console.log(i)
            bench(i + 1)
        } else {
            let finTime = new Date().getTime();
            ms = finTime - startTime
            s = ms / 1000
            qps = max / s
            ResponseUtil.Ok(req, res, { 'ms': ms, 'qps': qps })
        }
    })
    bench(0)
    */

    // ResponseUtil.Ok(req,res,data))
})

router.post('/:methodId', (req, res) => {
    let method = req.params.methodId
    ResponseUtil.Ok(req, res, method)
})

router.get('/date', (req, res) => {
    let time = Date.now()
    ResponseUtil.Ok(req, res, time)
})

router.get('/test', (req, res) => {
    let time = Date.now()
    userService.test()
    ResponseUtil.Ok(req, res, time)
})
module.exports = router
