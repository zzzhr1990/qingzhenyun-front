let express = require('express')
let router = express.Router()
let ApiException = require('../../../exception/api_exception')
let ApiValidateException = require('../../../exception/api_validate_exception')
let ResponseUtil = require('../../../util/response_util')
let StringUtil = require('../../../util/string_util')
let userService = require('../../../service/user_service')
var grpc = require('grpc')
let validator = require('validator')


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
    userService.registerUser(name, password, email, phone, ip, (err, data) => {
        if (err) {
            console.log(err)
            ResponseUtil.Ok(req, res, 0)
            console.log(err.errorCode)
        }
        else {
            ResponseUtil.Ok(req, res, data)
        }
    })
})


router.post('/benchmark', (req, res) => {

    // Do Register RPC
    let startTime = new Date().getTime();
    let max = 500000
    bench = (i) => userService.registerUser('name', 'password', 'email', 'phone', '127.0.0.1', (err, data) => {
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
